import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useOrdersStore } from '@/stores/orders';

const STAT_COLORS = {
  디자인: 'text-pink-700 font-bold',
  맛선택: 'text-orange-700 font-bold',
  사이즈: 'text-green-700 font-bold',
  시트: 'text-purple-700 font-bold',
  크림: 'text-yellow-700 font-bold',
};

const STAT_ICONS = {
  디자인: '🎨',
  맛선택: '🍰',
  사이즈: '📏',
  시트: '🥞',
  크림: '🧁',
};

const PROGRESS_COLORS = {
  디자인: 'bg-gradient-to-r from-pink-500 to-pink-600',
  맛선택: 'bg-gradient-to-r from-orange-500 to-orange-600',
  사이즈: 'bg-gradient-to-r from-green-500 to-green-600',
  시트: 'bg-gradient-to-r from-purple-500 to-purple-600',
  크림: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
};

const CARD_COLORS = {
  디자인: 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100',
  맛선택: 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100',
  사이즈: 'border-green-300 bg-gradient-to-br from-green-50 to-green-100',
  시트: 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100',
  크림: 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100',
};

export default function StatisticsCards() {
  const { statistics } = useOrdersStore();

  if (!statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.keys(STAT_ICONS).map((category) => (
          <Card key={category} data-testid={`card-stat-${category}`}>
            <CardHeader>
              <CardTitle className={`flex items-center ${STAT_COLORS[category as keyof typeof STAT_COLORS]}`}>
                <span className="mr-2">{STAT_ICONS[category as keyof typeof STAT_ICONS]}</span>
                {category}별 통계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                데이터가 없습니다
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Object.entries(statistics).map(([category, items]) => (
        <Card key={category} data-testid={`card-stat-${category}`} className={`border-2 shadow-lg ${CARD_COLORS[category as keyof typeof CARD_COLORS]}`}>
          <CardHeader>
            <CardTitle className={`flex items-center text-lg ${STAT_COLORS[category as keyof typeof STAT_COLORS]}`}>
              <span className="mr-2 text-2xl">{STAT_ICONS[category as keyof typeof STAT_ICONS]}</span>
              {category}별 통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                데이터가 없습니다
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item: any, index: number) => (
                  <div key={index} data-testid={`stat-item-${category}-${index}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                      <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-full shadow-sm">{item.count}개</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 shadow-sm ${PROGRESS_COLORS[category as keyof typeof PROGRESS_COLORS]}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
