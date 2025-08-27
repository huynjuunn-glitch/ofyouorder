import { useEffect, useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrdersStore } from '@/stores/orders';
import { sheetsUtils } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';
import OrderDetailModal from './OrderDetailModal';
import type { Order } from '@shared/schema';

export default function OrdersTable() {
  const { 
    orders,
    filteredOrders, 
    customerSearch, 
    orderSource,
    setCustomerSearch, 
    setOrderSource,
    error,
    clearError
  } = useOrdersStore();
  
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 정렬 상태 관리
  const [sortColumn, setSortColumn] = useState<keyof Order | null>('픽업일자');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | 'default'>('asc');

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: '오류 발생',
        description: error,
        variant: 'destructive'
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const uniqueOrderSources = sheetsUtils.getUniqueOrderSources(orders);

  // 정렬된 주문 목록 계산
  const sortedOrders = useMemo(() => {
    if (sortDirection === 'default' || !sortColumn) {
      // 기본 정렬: 픽업일자 오름차순
      return [...filteredOrders].sort((a, b) => {
        const dateA = sheetsUtils.parseDate(a.픽업일자);
        const dateB = sheetsUtils.parseDate(b.픽업일자);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.getTime() - dateB.getTime();
      });
    }

    return [...filteredOrders].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      
      // 날짜 컬럼인 경우 특별 처리
      if (sortColumn === '픽업일자' || sortColumn === '주문일자') {
        const dateA = sheetsUtils.parseDate(valueA);
        const dateB = sheetsUtils.parseDate(valueB);
        if (!dateA && !dateB) return 0;
        if (!dateA) return sortDirection === 'asc' ? 1 : -1;
        if (!dateB) return sortDirection === 'asc' ? -1 : 1;
        
        const comparison = dateA.getTime() - dateB.getTime();
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      // 문자열 비교
      const strA = (valueA || '').toString().toLowerCase();
      const strB = (valueB || '').toString().toLowerCase();
      
      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredOrders, sortColumn, sortDirection]);

  // 헤더 클릭 핸들러
  const handleHeaderClick = (column: keyof Order) => {
    if (sortColumn === column) {
      // 같은 컬럼 클릭: asc -> desc -> default
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection('default');
        setSortColumn('픽업일자');
      } else {
        setSortDirection('asc');
      }
    } else {
      // 다른 컬럼 클릭: 오름차순으로 시작
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // 정렬 아이콘 반환
  const getSortIcon = (column: keyof Order) => {
    if (sortColumn !== column) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    if (sortDirection === 'asc') return <ChevronUp className="w-4 h-4" />;
    if (sortDirection === 'desc') return <ChevronDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4 opacity-50" />;
  };

  return (
    <Card className="mb-8 border border-emerald-200 shadow-sm">
      <CardHeader className="bg-emerald-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-lg font-semibold text-emerald-800">📋 주문 내역</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-4 h-4" />
              <Input
                placeholder="고객명 검색"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                data-testid="input-customer-search"
                className="pl-10 w-full sm:w-48 border border-emerald-300 focus:border-emerald-500"
              />
            </div>
            <Select value={orderSource} onValueChange={setOrderSource}>
              <SelectTrigger className="w-full sm:w-40 border border-emerald-300 focus:border-emerald-500" data-testid="select-order-source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="모든 주문경로">모든 주문경로</SelectItem>
                {uniqueOrderSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-50 border-b border-emerald-200">
                <TableHead 
                  className="font-medium text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors"
                  onClick={() => handleHeaderClick('이름')}
                >
                  <div className="flex items-center gap-1">
                    고객명
                    {getSortIcon('이름')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-medium text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors"
                  onClick={() => handleHeaderClick('디자인')}
                >
                  <div className="flex items-center gap-1">
                    디자인
                    {getSortIcon('디자인')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-medium text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors"
                  onClick={() => handleHeaderClick('픽업일자')}
                >
                  <div className="flex items-center gap-1">
                    픽업일자
                    {getSortIcon('픽업일자')}
                  </div>
                </TableHead>
                <TableHead className="font-medium text-emerald-800">맛/시트/사이즈</TableHead>
                <TableHead 
                  className="font-medium text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors"
                  onClick={() => handleHeaderClick('요청사항')}
                >
                  <div className="flex items-center gap-1">
                    요청사항
                    {getSortIcon('요청사항')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-medium text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors"
                  onClick={() => handleHeaderClick('특이사항')}
                >
                  <div className="flex items-center gap-1">
                    특이사항
                    {getSortIcon('특이사항')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    조회된 주문이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                sortedOrders.map((order, index) => (
                  <TableRow 
                    key={index} 
                    data-testid={`row-order-${index}`} 
                    className="hover:bg-emerald-50 cursor-pointer transition-colors"
                    onClick={() => handleOrderClick(order)}
                  >
                    <TableCell className="font-medium text-emerald-900">{order.이름}</TableCell>
                    <TableCell className="text-emerald-700">{order.디자인}</TableCell>
                    <TableCell className="text-emerald-700">{order.픽업일자}</TableCell>
                    <TableCell className="text-emerald-700">
                      {`${order.맛선택}/${order.시트}/${order.사이즈}`}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-emerald-600">
                      {order.요청사항 || '-'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-emerald-600">
                      {order.특이사항 || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="px-6 py-3 bg-emerald-50 border-t border-emerald-200 mt-4 rounded-b-lg">
          <p className="text-sm font-medium text-emerald-700" data-testid="text-total-orders">
            총 <span className="font-semibold text-emerald-900">{sortedOrders.length}개</span>의 주문
            <span className="ml-2 text-xs text-emerald-600">💡 주문을 클릭하면 상세정보를 볼 수 있습니다</span>
          </p>
        </div>
      </CardContent>
      
      <OrderDetailModal 
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Card>
  );
}
