import { Order, StatItem, Statistics } from '@shared/schema';

export const groupUtils = {
  // Count occurrences by field
  countBy(orders: Order[], field: keyof Order): Record<string, number> {
    const counts: Record<string, number> = {};
    
    orders.forEach(order => {
      const value = order[field] as string;
      if (value && value.trim()) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    
    return counts;
  },

  // Convert counts to StatItem array and sort by count (descending)
  countsToStatItems(counts: Record<string, number>, limit = 10): StatItem[] {
    const items = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: 0 // Will be calculated below
    }));
    
    // Sort by count descending
    items.sort((a, b) => b.count - a.count);
    
    // Take top N items
    const topItems = items.slice(0, limit);
    
    // Calculate percentages based on max count in this group
    const maxCount = topItems[0]?.count || 1;
    topItems.forEach(item => {
      item.percentage = Math.round((item.count / maxCount) * 100);
    });
    
    return topItems;
  },

  // Generate statistics for all categories
  generateStatistics(orders: Order[]): Statistics {
    return {
      디자인: this.countsToStatItems(this.countBy(orders, '디자인')),
      맛선택: this.countsToStatItems(this.countBy(orders, '맛선택')),
      사이즈: this.countsToStatItems(this.countBy(orders, '사이즈')),
      시트: this.countsToStatItems(this.countBy(orders, '시트')),
      크림: this.countsToStatItems(this.countBy(orders, '크림')),
    };
  }
};
