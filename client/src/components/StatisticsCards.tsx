import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useOrdersStore } from '@/stores/orders';

const STAT_COLORS = {
  디자인: 'text-pink-500',
  맛선택: 'text-orange-500',
  사이즈: 'text-green-500',
  시트: 'text-purple-500',
  크림: 'text-yellow-500',
};

const STAT_ICONS = {
  디자인: '🎨',
  맛선택: '🍰',
  사이즈: '📏',
  시트: '🥞',
  크림: '🧁',
};

const PROGRESS_COLORS = {
  디자인: 'bg-pink-500',
  맛선택: 'bg-orange-500',
  사이즈: 'bg-green-500',
  시트: 'bg-purple-500',
  크림: 'bg-yellow-500',
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
        <Card key={category} data-testid={`card-stat-${category}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${STAT_COLORS[category as keyof typeof STAT_COLORS]}`}>
              <span className="mr-2">{STAT_ICONS[category as keyof typeof STAT_ICONS]}</span>
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
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-sm font-medium text-gray-900">{item.count}개</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${PROGRESS_COLORS[category as keyof typeof PROGRESS_COLORS]}`}
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
