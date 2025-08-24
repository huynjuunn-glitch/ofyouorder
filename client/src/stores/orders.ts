import { create } from 'zustand';
import { Order, Statistics } from '@shared/schema';
import { sheetsUtils } from '@/lib/sheets';
import { groupUtils } from '@/lib/group';

interface OrdersState {
  orders: Order[];
  filteredOrders: Order[];
  statistics: Statistics | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters
  dateRange: { start: Date | null; end: Date | null };
  customerSearch: string;
  orderSource: string;
  
  // Actions
  fetchOrders: (apiKey: string, sheetId: string, sheetName: string) => Promise<void>;
  setDateRange: (start: Date | null, end: Date | null) => void;
  setCustomerSearch: (search: string) => void;
  setOrderSource: (source: string) => void;
  applyFilters: () => void;
  clearError: () => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  filteredOrders: [],
  statistics: null,
  isLoading: false,
  error: null,
  
  dateRange: { start: null, end: null },
  customerSearch: '',
  orderSource: '모든 주문경로',

  fetchOrders: async (apiKey: string, sheetId: string, sheetName: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const orders = await sheetsUtils.fetchSheetData(apiKey, sheetId, sheetName);
      set({ orders });
      get().applyFilters();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  setDateRange: (start: Date | null, end: Date | null) => {
    set({ dateRange: { start, end } });
    get().applyFilters();
  },

  setCustomerSearch: (search: string) => {
    set({ customerSearch: search });
    get().applyFilters();
  },

  setOrderSource: (source: string) => {
    set({ orderSource: source });
    get().applyFilters();
  },

  applyFilters: () => {
    const { orders, dateRange, customerSearch, orderSource } = get();
    
    let filtered = [...orders];
    
    // Apply date filter
    filtered = sheetsUtils.filterByDate(filtered, dateRange.start, dateRange.end);
    
    // Apply customer search filter
    filtered = sheetsUtils.filterByCustomerName(filtered, customerSearch);
    
    // Apply order source filter
    filtered = sheetsUtils.filterByOrderSource(filtered, orderSource);
    
    // Generate statistics
    const statistics = groupUtils.generateStatistics(filtered);
    
    set({ filteredOrders: filtered, statistics });
  },

  clearError: () => {
    set({ error: null });
  },
}));
