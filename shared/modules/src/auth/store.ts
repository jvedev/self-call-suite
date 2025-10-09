import { proxy } from 'valtio';
import { AuthState, User, LoginCredentials, RegisterData } from './types.js';

export const AuthStore = proxy<AuthState>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

// Auth actions
export const setLoading = (loading: boolean) => {
  AuthStore.isLoading = loading;
};

export const setError = (error: string | null) => {
  AuthStore.error = error;
};

export const setUser = (user: User | null) => {
  AuthStore.user = user;
  AuthStore.isAuthenticated = !!user;
};

export const setToken = (token: string | null) => {
  AuthStore.token = token;
  if (token && typeof localStorage !== 'undefined') {
    localStorage.setItem('hema-auth-token', token);
  } else if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('hema-auth-token');
  }
};

export const login = async (credentials: LoginCredentials) => {
  setLoading(true);
  setError(null);
  
  try {
    // This would normally make an API call
    // For now, we'll simulate a successful login
    const mockUser: User = {
      id: '1',
      username: credentials.username,
      email: `${credentials.username}@example.com`,
      role: 'table_crew',
      createdAt: Date.now(),
      lastLogin: Date.now(),
    };
    
    const mockToken = 'mock-jwt-token';
    
    setUser(mockUser);
    setToken(mockToken);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Login failed');
  } finally {
    setLoading(false);
  }
};

export const register = async (data: RegisterData) => {
  setLoading(true);
  setError(null);
  
  try {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    // This would normally make an API call
    const mockUser: User = {
      id: Date.now().toString(),
      username: data.username,
      email: data.email,
      role: 'competitor',
      createdAt: Date.now(),
    };
    
    const mockToken = 'mock-jwt-token';
    
    setUser(mockUser);
    setToken(mockToken);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Registration failed');
  } finally {
    setLoading(false);
  }
};

export const logout = () => {
  setUser(null);
  setToken(null);
  setError(null);
};

export const loadAuthFromStorage = () => {
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('hema-auth-token');
    if (token) {
      // In a real app, you would validate the token with the server
      setToken(token);
      // For now, we'll just set a mock user if token exists
      const mockUser: User = {
        id: '1',
        username: 'stored_user',
        email: 'stored@example.com',
        role: 'table_crew',
        createdAt: Date.now() - 86400000, // Yesterday
        lastLogin: Date.now(),
      };
      setUser(mockUser);
    }
  }
};