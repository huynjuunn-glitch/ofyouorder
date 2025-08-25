import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
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
                <TableHead className="font-medium text-emerald-800">고객명</TableHead>
                <TableHead className="font-medium text-emerald-800">디자인</TableHead>
                <TableHead className="font-medium text-emerald-800">픽업일자</TableHead>
                <TableHead className="font-medium text-emerald-800">맛/시트/사이즈</TableHead>
                <TableHead className="font-medium text-emerald-800">요청사항</TableHead>
                <TableHead className="font-medium text-emerald-800">특이사항</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    조회된 주문이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
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
            총 <span className="font-semibold text-emerald-900">{filteredOrders.length}개</span>의 주문
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
