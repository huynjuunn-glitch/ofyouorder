import { create } from 'zustand';
import { authUtils } from '@/lib/auth';

interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userEmail: null,

  login: (email: string, password: string) => {
    const success = authUtils.login(email, password);
    if (success) {
      set({ isAuthenticated: true, userEmail: email });
    }
    return success;
  },


  logout: () => {
    authUtils.logout();
    set({ isAuthenticated: false, userEmail: null });
  },

  checkAuth: () => {
    // 어드민 계정 초기화
    authUtils.initializeAdmin();
    
    const isAuth = authUtils.isAuthenticated();
    const email = authUtils.getCurrentUserEmail();
    set({ isAuthenticated: isAuth, userEmail: email });
  },
}));
