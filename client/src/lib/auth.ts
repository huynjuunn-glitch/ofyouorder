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
  // Initialize admin account if not exists
  initializeAdmin(): void {
    const users = this.getUsers();
    const adminExists = users.some(user => user.email === 'ofyou');
    
    if (!adminExists) {
      users.push({ email: 'ofyou', password: 'qkrrk1212!' });
      this.saveUsers(users);
      console.log('어드민 계정이 자동으로 생성되었습니다: ofyou');
    } else {
      // 기존 어드민 계정이 있는지 확인하고 비밀번호가 맞는지 체크
      const adminUser = users.find(user => user.email === 'ofyou');
      if (adminUser && adminUser.password !== 'qkrrk1212!') {
        // 비밀번호가 다르면 업데이트
        adminUser.password = 'qkrrk1212!';
        this.saveUsers(users);
        console.log('어드민 계정 비밀번호가 업데이트되었습니다.');
      }
    }
    
    // 강제로 어드민 계정 재생성 (디버깅용)
    const currentUsers = this.getUsers();
    const hasCorrectAdmin = currentUsers.some(user => 
      user.email === 'ofyou' && user.password === 'qkrrk1212!'
    );
    
    if (!hasCorrectAdmin) {
      // 기존 ofyou 계정 제거하고 새로 생성
      const filteredUsers = currentUsers.filter(user => user.email !== 'ofyou');
      filteredUsers.push({ email: 'ofyou', password: 'qkrrk1212!' });
      this.saveUsers(filteredUsers);
      console.log('어드민 계정이 강제로 재생성되었습니다.');
    }
  },

  // Get all users from localStorage
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  // Save users to localStorage
  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Register new user
  register(email: string, password: string): boolean {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return false;
    }
    
    users.push({ email, password });
    this.saveUsers(users);
    return true;
  },

  // Login user
  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const token: AuthToken = {
        email,
        token: Math.random().toString(36).substring(2, 15),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(token));
      return true;
    }
    
    return false;
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
