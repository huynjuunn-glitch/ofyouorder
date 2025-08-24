import { useState } from 'react';
import { Search } from 'lucide-react';
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
    
    // 하루만 선택해도 시작날짜와 종료날짜 모두 표시
    if (start === end) {
      return `${start} - ${end} (총 1일)`;
    }
    
    const diffTime = Math.abs(selectedRange.to!.getTime() - selectedRange.from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return `${start} - ${end} (총 ${diffDays}일)`;
  };

  return (
    <Card className="mb-8 border-2 border-pink-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
        <CardTitle className="text-xl font-bold text-pink-700">
          📅 조회 기간 선택
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="border-2 border-pink-300 rounded-lg p-4 bg-pink-50">
              <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={handleRangeSelect}
                data-testid="calendar-date-picker"
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardContent className="pt-4">
                <h3 className="font-bold text-blue-800 mb-2 text-lg">선택된 기간</h3>
                <div className="text-sm text-blue-700">
                  <p data-testid="text-selected-range" className="font-bold text-lg text-blue-900">
                    {formatDateRange()}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Button 
              onClick={handleFetchOrders} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 text-lg shadow-lg"
              disabled={isLoading}
              data-testid="button-fetch-orders"
            >
              <Search className="w-5 h-5 mr-2" />
              {isLoading ? '조회 중...' : '주문 조회'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
