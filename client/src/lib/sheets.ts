import { Order } from '@shared/schema';

export interface GoogleSheetsResponse {
  values: string[][];
}

export const sheetsUtils = {
  // Fetch data from Google Sheets
  async fetchSheetData(apiKey: string, sheetId: string, sheetName: string): Promise<Order[]> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:K2000?key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: GoogleSheetsResponse = await response.json();
      
      if (!data.values || data.values.length < 2) {
        return [];
      }
      
      // Skip header row and convert to Order objects
      const orders: Order[] = data.values.slice(1).map(row => ({
        이름: row[0] || '',
        디자인: row[1] || '',
        주문일자: row[2] || '',
        픽업일자: row[3] || '',
        맛선택: row[4] || '',
        시트: row[5] || '',
        사이즈: row[6] || '',
        크림: row[7] || '',
        요청사항: row[8] || '',
        특이사항: row[9] || '',
        주문경로: row[10] || '',
      }));
      
      return orders;
    } catch (error) {
      console.error('Google Sheets API Error:', error);
      throw new Error('시트를 \'링크가 있는 모든 사용자\'로 공유했는지, API Key/Sheet ID/Sheet Name을 확인하세요.');
    }
  },

  // Parse date string (supports YYYY.MM.DD and YYYY-MM-DD formats)
  parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    
    // Replace dots with dashes for consistent parsing
    const normalizedDate = dateStr.replace(/\./g, '-');
    const date = new Date(normalizedDate);
    
    return isNaN(date.getTime()) ? null : date;
  },

  // Filter orders by date range (based on pickup date)
  filterByDate(orders: Order[], startDate: Date | null, endDate: Date | null): Order[] {
    if (!startDate && !endDate) return orders;
    
    return orders.filter(order => {
      const pickupDate = this.parseDate(order.픽업일자);
      if (!pickupDate) return false;
      
      // 날짜만 비교하기 위해 시간을 00:00:00으로 설정
      const pickupDateOnly = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate());
      
      if (startDate) {
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        if (pickupDateOnly < startDateOnly) return false;
      }
      
      if (endDate) {
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        if (pickupDateOnly > endDateOnly) return false;
      }
      
      return true;
    });
  },

  // Filter orders by customer name
  filterByCustomerName(orders: Order[], searchTerm: string): Order[] {
    if (!searchTerm.trim()) return orders;
    
    const term = searchTerm.toLowerCase();
    return orders.filter(order => 
      order.이름.toLowerCase().includes(term)
    );
  },

  // Filter orders by order source
  filterByOrderSource(orders: Order[], source: string): Order[] {
    if (!source || source === '모든 주문경로') return orders;
    
    return orders.filter(order => order.주문경로 === source);
  },

  // Get unique order sources
  getUniqueOrderSources(orders: Order[]): string[] {
    const sources = new Set(orders.map(order => order.주문경로).filter(Boolean));
    return Array.from(sources).sort();
  }
};
