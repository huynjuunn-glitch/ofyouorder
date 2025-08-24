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
    <Card className="mb-8 border-2 border-orange-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-xl font-bold text-orange-700">📋 주문 내역</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
              <Input
                placeholder="고객명 검색"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                data-testid="input-customer-search"
                className="pl-10 w-full sm:w-48 border-2 border-orange-300 focus:border-orange-500 font-medium"
              />
            </div>
            <Select value={orderSource} onValueChange={setOrderSource}>
              <SelectTrigger className="w-full sm:w-40 border-2 border-orange-300 focus:border-orange-500 font-medium" data-testid="select-order-source">
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
              <TableRow className="bg-gradient-to-r from-orange-100 to-amber-100 border-b-2 border-orange-300">
                <TableHead className="font-bold text-orange-800">고객명</TableHead>
                <TableHead className="font-bold text-orange-800">디자인</TableHead>
                <TableHead className="font-bold text-orange-800">주문일자</TableHead>
                <TableHead className="font-bold text-orange-800">픽업일자</TableHead>
                <TableHead className="font-bold text-orange-800">맛/시트/사이즈</TableHead>
                <TableHead className="font-bold text-orange-800">요청사항</TableHead>
                <TableHead className="font-bold text-orange-800">특이사항</TableHead>
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
                  <TableRow key={index} data-testid={`row-order-${index}`} className="hover:bg-orange-50">
                    <TableCell className="font-bold text-gray-800">{order.이름}</TableCell>
                    <TableCell className="font-semibold text-pink-600">{order.디자인}</TableCell>
                    <TableCell className="font-medium text-blue-600">{order.주문일자}</TableCell>
                    <TableCell className="font-medium text-green-600">{order.픽업일자}</TableCell>
                    <TableCell className="font-medium text-purple-600">
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
        <div className="px-6 py-3 bg-gradient-to-r from-orange-100 to-amber-100 border-t-2 border-orange-300 mt-4 rounded-b-lg">
          <p className="text-base font-bold text-orange-800" data-testid="text-total-orders">
            총 <span className="font-black text-xl text-orange-900">{filteredOrders.length}개</span>의 주문
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
