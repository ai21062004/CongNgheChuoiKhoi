// ============================================
// Auth Context - Authentication State Management
// ============================================
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import * as authServiceApi from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithMetaMask: (address: string, signature: string, message: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, walletAddress: string, signature: string, message: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper: chuyển API response → User type
function apiUserToUser(apiUser: authServiceApi.AuthResponse['user']): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: 'user', // Backend sẽ bổ sung role sau
    walletAddress: apiUser.walletAddress,
    createdAt: apiUser.createdAt,
    isLocked: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true lúc đầu để check token

  // Khôi phục session từ localStorage khi app khởi động
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('blockdata_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await authServiceApi.getMe();
        setUser(apiUserToUser(data.user));
      } catch {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem('blockdata_token');
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await authServiceApi.loginEmail({ email, password });
      localStorage.setItem('blockdata_token', data.token);
      setUser(apiUserToUser(data.user));
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message;
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithMetaMask = useCallback(async (
    address: string,
    signature: string,
    message: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await authServiceApi.loginWallet({
        walletAddress: address,
        signature,
        message,
      });
      localStorage.setItem('blockdata_token', data.token);
      setUser(apiUserToUser(data.user));
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message;
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await authServiceApi.registerUser({
        name,
        email,
        password,
        walletAddress,
        signature,
        message,
      });
      localStorage.setItem('blockdata_token', data.token);
      setUser(apiUserToUser(data.user));
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message;
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('blockdata_token');
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        loginWithMetaMask,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
