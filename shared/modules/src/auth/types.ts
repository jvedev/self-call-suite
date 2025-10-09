export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'organizer' | 'table_crew' | 'competitor';
  createdAt: number;
  lastLogin?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email: string;
  confirmPassword: string;
}