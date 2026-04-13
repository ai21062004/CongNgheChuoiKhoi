// ============================================
// API Client - Axios Instance
// ============================================
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: gắn JWT token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blockdata_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('blockdata_token');
      // Chỉ redirect nếu không phải đang ở trang auth
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
