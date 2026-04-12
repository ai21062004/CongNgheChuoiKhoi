// ============================================
// Profile Page
// ============================================
import { useState } from 'react';
import { User, Mail, Wallet, Shield, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { formatDate } from '../../utils/helpers';
import '../shared.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { address, balance } = useWallet();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    updateProfile({ name, email });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Hồ sơ cá nhân</h2>
          <p>Quản lý thông tin tài khoản và kết nối ví của bạn</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar-large">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>
          <div className="badge badge-success" style={{ marginBottom: 'var(--space-4)' }}>
            {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng chuẩn'}
          </div>
          
          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)', textAlign: 'left' }}>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Ví kết nối</div>
            <div className="profile-wallet" title={address || user.walletAddress}>
              <Wallet size={14} />
              {address ? `${address.slice(0,8)}...${address.slice(-6)}` : 'Chưa kết nối ví'}
            </div>
            {balance && (
              <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, marginTop: 'var(--space-2)' }}>
                Số dư: {balance} ETH
              </div>
            )}
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Thông tin chi tiết</span>
              {!isEditing && (
                <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
              )}
            </div>
          </div>
          <div className="detail-card-body">
            <div className="form-field">
              <label><User size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: 4 }}/> Họ và tên</label>
              {isEditing ? (
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
              ) : (
                <div className="detail-field-value" style={{ padding: 'var(--space-2) 0' }}>{user.name}</div>
              )}
            </div>

            <div className="form-field">
              <label><Mail size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: 4 }}/> Email</label>
              {isEditing ? (
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              ) : (
                <div className="detail-field-value" style={{ padding: 'var(--space-2) 0' }}>{user.email}</div>
              )}
            </div>

            <div className="form-field">
              <label><Shield size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: 4 }}/> Ngày tham gia</label>
              <div className="detail-field-value" style={{ padding: 'var(--space-2) 0' }}>{formatDate(user.createdAt)}</div>
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button className="btn btn-primary" onClick={handleSave}>Lưu thay đổi</button>
                <button className="btn btn-secondary" onClick={() => {
                  setIsEditing(false);
                  setName(user.name);
                  setEmail(user.email);
                }}>Huỷ</button>
              </div>
            )}
            
            {!isEditing && (
              <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: 'var(--font-base)', marginBottom: 'var(--space-4)' }}>Bảo mật</h3>
                <button className="btn btn-secondary"><Key size={18} /> Đổi mật khẩu</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
