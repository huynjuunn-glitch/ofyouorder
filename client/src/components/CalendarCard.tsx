import { useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrdersStore } from '@/stores/orders';
import { useToast } from '@/hooks/use-toast';
import 'react-day-picker/dist/style.css';

export default function CalendarCard() {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const { setDateRange, fetchOrders, isLoading } = useOrdersStore();
  const { toast } = useToast();

  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    setDateRange(range?.from || null, range?.to || null);
  };

  const handleFetchOrders = async () => {
    // Get settings from localStorage
    const apiKey = localStorage.getItem('cake_manager_api_key');
    const sheetId = localStorage.getItem('cake_manager_sheet_id');
    const sheetName = localStorage.getItem('cake_manager_sheet_name') || '주문내역';

    if (!apiKey || !sheetId) {
      toast({
        title: '설정이 필요합니다',
        description: 'Google Sheets API 설정을 먼저 완료해주세요.',
        variant: 'destructive'
      });
      // Open settings modal
      window.dispatchEvent(new CustomEvent('openSettingsModal'));
      return;
    }

    try {
      await fetchOrders(apiKey, sheetId, sheetName);
      toast({
        title: '조회 완료',
        description: '주문 데이터를 성공적으로 불러왔습니다.'
      });
    } catch (error) {
      // Error is handled in the store
    }
  };

  const formatDateRange = () => {
    if (!selectedRange?.from) return '날짜를 선택하세요';
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '.').replace(/\s/g, '');
    };
    
    const start = formatDate(selectedRange.from);
    const end = selectedRange.to ? formatDate(selectedRange.to) : start;
    
    if (start === end) {
      return `${start} (1일)`;
    }
    
    const diffTime = Math.abs(selectedRange.to!.getTime() - selectedRange.from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return `${start} - ${end} (총 ${diffDays}일)`;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>📅 조회 기간 선택</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={handleRangeSelect}
                data-testid="calendar-date-picker"
                className="mx-auto"
              />
            </div>
          </div>
          <div className="space-y-4">
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <h3 className="font-medium text-gray-900 mb-2">선택된 기간</h3>
                <div className="text-sm text-gray-600">
                  <p data-testid="text-selected-range" className="font-medium text-primary-600">
                    {formatDateRange()}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Button 
              onClick={handleFetchOrders} 
              className="w-full"
              disabled={isLoading}
              data-testid="button-fetch-orders"
            >
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? '조회 중...' : '주문 조회'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
