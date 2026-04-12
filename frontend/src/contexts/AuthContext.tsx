// ============================================
// Auth Context - Authentication State Management
// ============================================
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '../types';
import { mockCurrentUser, mockAdminUser } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithMetaMask: (address: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    
    if (email === 'admin@system.com') {
      setUser(mockAdminUser);
    } else {
      setUser({ ...mockCurrentUser, email });
    }
    setIsLoading(false);
    return true;
  }, []);

  const loginWithMetaMask = useCallback(async (address: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    // Simulate finding user by wallet or creating new session
    setUser({
      ...mockCurrentUser,
      id: 'mm-user-' + address.slice(0, 8),
      name: 'User ' + address.slice(-4),
      email: 'Chưa cập nhật',
      walletAddress: address,
    });
    
    setIsLoading(false);
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    setUser({
      ...mockCurrentUser,
      id: 'user-new-' + Date.now(),
      name,
      email,
      createdAt: new Date().toISOString(),
    });
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
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
