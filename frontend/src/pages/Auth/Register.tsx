// ============================================
// Register Page
// ============================================
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loginWithMetaMask, isLoading } = useAuth();
  const { connect, isConnecting } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    const success = await register(name, email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
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
      setError(err.message || 'Lỗi kết nối MetaMask');
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

        <h1 className="auth-title">Đăng ký</h1>
        <p className="auth-subtitle">Tạo tài khoản để bắt đầu quản lý dữ liệu an toàn.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="name">Họ và tên</label>
            <input
              id="name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-password">Mật khẩu</label>
            <input
              id="reg-password"
              type="password"
              placeholder="Ít nhất 6 ký tự"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
          </button>
        </form>

        <div className="auth-divider"><span>hoặc</span></div>

        <button type="button" className="auth-metamask-btn" onClick={handleMetaMask} disabled={isConnecting}>
          <Wallet size={18} />
          {isConnecting ? 'Đang kết nối...' : 'Đăng ký bằng MetaMask'}
        </button>

        <div className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
