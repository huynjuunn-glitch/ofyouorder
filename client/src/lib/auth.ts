export interface User {
  email: string;
  password: string;
}

export interface AuthToken {
  email: string;
  token: string;
  expires: number;
}

const USERS_KEY = 'cake_manager_users';
const AUTH_KEY = 'cake_manager_auth';

export const authUtils = {
  // Initialize admin account (only ofyou account allowed)
  initializeAdmin(): void {
    // 고정된 어드민 계정만 설정 (다른 계정 불허)
    const fixedAdmin = [{ email: 'ofyou', password: 'qkrrk1212!' }];
    this.saveUsers(fixedAdmin);
  },

  // Get all users from localStorage (only admin account)
  getUsers(): User[] {
    return [{ email: 'ofyou', password: 'qkrrk1212!' }];
  },

  // Save users to localStorage
  saveUsers(users: User[]): void {
    // 오직 ofyou 계정만 저장
    const adminOnly = users.filter(user => user.email === 'ofyou');
    localStorage.setItem(USERS_KEY, JSON.stringify(adminOnly));
  },

  // Login user (only ofyou account allowed)
  login(email: string, password: string): boolean {
    // 오직 고정된 계정만 허용
    if (email === 'ofyou' && password === 'qkrrk1212!') {
      const token: AuthToken = {
        email,
        token: Math.random().toString(36).substring(2, 15),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(token));
      
      // 구글 연결정보 자동 설정
      this.setGoogleSheetSettings();
      return true;
    }
    
    return false;
  },

  // 구글 시트 설정 자동 저장
  setGoogleSheetSettings(): void {
    localStorage.setItem('cake_manager_api_key', 'AIzaSyCYEMuw-k4sc_68scPThQQ7HmaKmHIn_hY');
    localStorage.setItem('cake_manager_sheet_id', '1j3XvcpJgjYnqcnk1WXxWv6a19ugiwhjExRRWSun52kk');
    localStorage.setItem('cake_manager_sheet_name', '주문정보');
    console.log('구글 시트 설정이 자동으로 저장되었습니다.');
  },

  // Get current auth token
  getAuthToken(): AuthToken | null {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) return null;
    
    const token = JSON.parse(auth) as AuthToken;
    
    // Check if token is expired
    if (Date.now() > token.expires) {
      this.logout();
      return null;
    }
    
    return token;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  },

  // Get current user email
  getCurrentUserEmail(): string | null {
    const token = this.getAuthToken();
    return token?.email || null;
  },

  // Logout user
  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }
};
