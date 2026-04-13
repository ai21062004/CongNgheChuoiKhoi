// ============================================
// Auth Service - Frontend API calls
// ============================================
import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  walletAddress: string;
  signature: string;
  message: string;
}

export interface LoginEmailData {
  email: string;
  password: string;
}

export interface LoginWalletData {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    walletAddress: string;
    createdAt: string;
  };
}

/**
 * Đăng ký tài khoản mới
 */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
}

/**
 * Đăng nhập bằng email + password
 */
export async function loginEmail(data: LoginEmailData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
}

/**
 * Đăng nhập bằng MetaMask wallet
 */
export async function loginWallet(data: LoginWalletData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login-wallet', data);
  return response.data;
}

/**
 * Lấy thông tin user hiện tại
 */
export async function getMe(): Promise<{ user: AuthResponse['user'] }> {
  const response = await api.get<{ user: AuthResponse['user'] }>('/auth/me');
  return response.data;
}
