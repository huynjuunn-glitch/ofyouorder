import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Palette, Phone, FileText, AlertCircle, MapPin } from 'lucide-react';
import type { Order } from '@shared/schema';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            {order.이름}님의 주문 상세정보
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            주문의 전체 상세 정보를 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 기본 정보 */}
          <Card className="border-blue-200">
            <CardContent className="pt-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                기본 정보
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">고객명:</span>
                  <p className="font-medium text-gray-900">{order.이름 || ''}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">연락처:</span>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {order.연락처 || ''}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">주문일자:</span>
                  <p className="font-medium text-gray-900">{order.주문일자 || ''}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">픽업일자:</span>
                  <p className="font-medium text-gray-900">{order.픽업일자 || ''}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">주문경로:</span>
                  <Badge variant="outline" className="text-xs">
                    {order.주문경로 || ''}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 케이크 정보 */}
          <Card className="border-pink-200">
            <CardContent className="pt-4">
              <h3 className="font-semibold text-pink-800 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                케이크 정보
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">디자인:</span>
                  <p className="font-medium text-gray-900">{order.디자인 || ''}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">맛 선택:</span>
                  <p className="font-medium text-gray-900">{order.맛선택 || ''}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">시트:</span>
                  <p className="font-medium text-gray-900">{order.시트 || ''}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">사이즈:</span>
                  <p className="font-medium text-gray-900">{order.사이즈 || ''}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">크림:</span>
                  <p className="font-medium text-gray-900">{order.크림 || ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 요청사항 및 특이사항 */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="border-green-200">
              <CardContent className="pt-4">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  요청사항
                </h3>
                <p className="text-gray-700 bg-green-50 p-3 rounded-md border border-green-100 min-h-[60px]">
                  {order.요청사항 || ''}
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="pt-4">
                <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  특이사항
                </h3>
                <p className="text-gray-700 bg-orange-50 p-3 rounded-md border border-orange-100 min-h-[60px]">
                  {order.특이사항 || ''}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}