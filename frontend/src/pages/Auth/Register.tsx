// ============================================
// Register Page
// ============================================
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Wallet } from 'lucide-react';
import { BrowserProvider } from 'ethers';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showMetaMaskPopup, setShowMetaMaskPopup] = useState(false);
  
  const { register, isLoading } = useAuth();
  const { connect, isConnecting, isConnected, address } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isConnected || !address) {
      setError('Vui lòng liên kết MetaMask trước khi đăng ký');
      return;
    }

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

    try {
      // Yêu cầu ký message xác nhận ownership
      if (!window.ethereum) {
        setError('MetaMask chưa được cài đặt');
        return;
      }

      const message = `BlockData Register: ${Date.now()}`;
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      const success = await register(name, email, password, address, signature, message);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  const handleMetaMask = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setShowMetaMaskPopup(true);
      return;
    }
    try {
      await connect();
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối MetaMask');
    }
  };

  return (
    <div className="auth-page">
      {showMetaMaskPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#1e1e2d', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', backgroundColor: 'rgba(246, 133, 27, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet style={{ color: '#f6851b' }} size={32} />
            </div>
            <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '1.25rem', fontWeight: 600 }}>Cần có MetaMask</h3>
            <p style={{ color: '#9ca3af', marginBottom: '24px', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Bạn cần tải extension MetaMask để liên kết tài khoản và đăng ký.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                type="button" 
                onClick={() => setShowMetaMaskPopup(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s', flex: 1 }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Đóng
              </button>
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#f6851b', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, transition: 'all 0.2s', flex: 1 }}
                onClick={() => setShowMetaMaskPopup(false)}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e27618'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f6851b'}
              >
                Tải Extension
              </a>
            </div>
          </div>
        </div>
      )}

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

          <div className="auth-field" style={{ marginTop: '8px' }}>
            <label>Xác thực Blockchain (Bắt buộc)</label>
            {!isConnected ? (
                <button 
                  type="button" 
                  className="auth-metamask-btn" 
                  onClick={handleMetaMask} 
                  disabled={isConnecting}
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  <Wallet size={18} />
                  {isConnecting ? 'Đang kết nối...' : 'Liên kết MetaMask'}
                </button>
             ) : (
                <div style={{ marginTop: '4px', padding: '12px', backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: '8px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <Wallet size={18} />
                  <span>Đã liên kết ví: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </div>
             )}
          </div>

          <button 
            type="submit" 
            className="auth-submit" 
            disabled={isLoading || !isConnected}
            style={{ 
              marginTop: '1.5rem',
              opacity: (!isConnected) ? 0.6 : 1,
              cursor: (!isConnected) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Đang xử lý...' : (!isConnected ? 'Cần liên kết MetaMask' : 'Tạo tài khoản')}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
