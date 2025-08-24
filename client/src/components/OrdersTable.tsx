import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrdersStore } from '@/stores/orders';
import { sheetsUtils } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';

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
    <Card className="mb-8 border border-gray-200">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-lg font-semibold text-gray-900">📋 주문 내역</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="고객명 검색"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                data-testid="input-customer-search"
                className="pl-10 w-full sm:w-48 border border-gray-300 focus:border-gray-500"
              />
            </div>
            <Select value={orderSource} onValueChange={setOrderSource}>
              <SelectTrigger className="w-full sm:w-40 border border-gray-300 focus:border-gray-500" data-testid="select-order-source">
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
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-medium text-gray-900">고객명</TableHead>
                <TableHead className="font-medium text-gray-900">디자인</TableHead>
                <TableHead className="font-medium text-gray-900">주문일자</TableHead>
                <TableHead className="font-medium text-gray-900">픽업일자</TableHead>
                <TableHead className="font-medium text-gray-900">맛/시트/사이즈</TableHead>
                <TableHead className="font-medium text-gray-900">요청사항</TableHead>
                <TableHead className="font-medium text-gray-900">특이사항</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    조회된 주문이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                  <TableRow key={index} data-testid={`row-order-${index}`} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{order.이름}</TableCell>
                    <TableCell className="text-gray-700">{order.디자인}</TableCell>
                    <TableCell className="text-gray-700">{order.주문일자}</TableCell>
                    <TableCell className="text-gray-700">{order.픽업일자}</TableCell>
                    <TableCell className="text-gray-700">
                      {`${order.맛선택}/${order.시트}/${order.사이즈}`}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600">
                      {order.요청사항 || '-'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600">
                      {order.특이사항 || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 mt-4 rounded-b-lg">
          <p className="text-sm font-medium text-gray-700" data-testid="text-total-orders">
            총 <span className="font-semibold text-gray-900">{filteredOrders.length}개</span>의 주문
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
