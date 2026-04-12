// ============================================
// Login Page
// ============================================
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithMetaMask, isLoading } = useAuth();
  const { connect, isConnecting } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  const handleMetaMask = async () => {
    try {
      const address = await connect();
      if (address) {
        const success = await loginWithMetaMask(address);
        if (success) navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập qua MetaMask');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">
            <Database size={24} />
          </div>
          <span className="auth-logo-text">BlockData</span>
        </Link>

        <h1 className="auth-title">Đăng nhập</h1>
        <p className="auth-subtitle">Chào mừng trở lại! Nhập thông tin để tiếp tục.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-divider"><span>hoặc</span></div>

        <button className="auth-metamask-btn" onClick={handleMetaMask} disabled={isConnecting}>
          <Wallet size={18} />
          {isConnecting ? 'Đang kết nối...' : 'Đăng nhập bằng MetaMask'}
        </button>

        <div className="auth-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}
