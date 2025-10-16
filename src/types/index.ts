export interface User {
  id: string;
  email: string;
  hasPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  _id: string;
  username: string;
  role: 'admin' | 'seller';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
}
