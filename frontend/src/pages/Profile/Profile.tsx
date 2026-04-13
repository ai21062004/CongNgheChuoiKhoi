// ============================================
// Profile Page
// ============================================
import { useState, useEffect } from 'react';
import { User, Mail, Wallet, Shield, Key, Eye, EyeOff, X, CheckCircle, AlertCircle } from 'lucide-react';
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



  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Confirmation Modals State
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showPassConfirmFinal, setShowPassConfirmFinal] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; visible: boolean; type: 'success' | 'error' }>({ 
    message: '', 
    visible: false, 
    type: 'success' 
  });

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ ...toast, visible: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  useEffect(() => {
    if (showPasswordModal || showSaveConfirm || showPassConfirmFinal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPasswordModal, showSaveConfirm, showPassConfirmFinal]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ message: msg, visible: true, type });
  };

  const showSuccess = (msg: string) => showToast(msg, 'success');
  const showError = (msg: string) => showToast(msg, 'error');

  const handleSave = () => {
    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    updateProfile({ name, email });
    setIsEditing(false);
    setShowSaveConfirm(false);
    showSuccess('Cập nhật thông tin hồ sơ thành công!');
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOldPass(false);
    setShowNewPass(false);
    setShowConfirmPass(false);
  };

  const handlePasswordConfirm = () => {
    if (newPassword !== confirmPassword) {
      showError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (newPassword.length < 6) {
      showError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    setShowPassConfirmFinal(true);
  };

  const confirmPasswordChange = () => {
    // Logic for changing password would go here
    handlePasswordCancel();
    setShowPassConfirmFinal(false);
    showSuccess('Đổi mật khẩu thành công!');
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <div className="profile-grid" style={{ gridTemplateColumns: '1fr' }}>
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
            {/* Wallet Info Section Moved Here */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Ví kết nối</div>
              <div className="profile-wallet" title={address || user.walletAddress}>
                <Wallet size={14} />
                {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'Chưa kết nối ví'}
              </div>
              {balance && (
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, marginTop: 'var(--space-2)' }}>
                  Số dư: {balance} ETH
                </div>
              )}
            </div>
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

            {!isEditing && (
              <div className="form-field">
                <label><Shield size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: 4 }}/> Ngày tham gia</label>
                <div className="detail-field-value" style={{ padding: 'var(--space-2) 0' }}>{formatDate(user.createdAt)}</div>
              </div>
            )}

            {isEditing && (
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button className="btn btn-primary" onClick={() => setShowSaveConfirm(true)}>Lưu thay đổi</button>
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
                <button className="btn btn-secondary" onClick={() => setShowPasswordModal(true)}><Key size={18} /> Đổi mật khẩu</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="modal-overlay visible" style={{ zIndex: 1100 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)' }}>
             <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Đổi mật khẩu
                <button type="button" onClick={handlePasswordCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20}/></button>
             </h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-field">
                  <label htmlFor="oldPass">Mật khẩu cũ</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      id="oldPass" 
                      type={showOldPass ? 'text' : 'password'} 
                      value={oldPassword} 
                      onChange={e => setOldPassword(e.target.value)} 
                      placeholder="Nhập mật khẩu hiện tại"
                      style={{ width: '100%', paddingRight: '40px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowOldPass(!showOldPass)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="newPass">Mật khẩu mới</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      id="newPass" 
                      type={showNewPass ? 'text' : 'password'} 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                      placeholder="Nhập mật khẩu mới"
                      style={{ width: '100%', paddingRight: '40px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="confirmPass">Xác nhận mật khẩu mới</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      id="confirmPass" 
                      type={showConfirmPass ? 'text' : 'password'} 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      placeholder="Nhập lại mật khẩu mới"
                      style={{ width: '100%', paddingRight: '40px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
             </div>

             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button className="btn btn-secondary" onClick={handlePasswordCancel}>Huỷ</button>
                <button className="btn btn-primary" onClick={handlePasswordConfirm} disabled={!oldPassword || !newPassword || !confirmPassword}>Xác nhận</button>
             </div>
          </div>
        </div>
      )}

      {/* SAVE PROFILE CONFIRMATION MODAL */}
      {showSaveConfirm && (
        <div className="modal-overlay visible" style={{ zIndex: 1200 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
             <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Xác nhận thay đổi</h3>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Bạn có chắc chắn muốn lưu các thay đổi thông tin cá nhân này không?</p>
             <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowSaveConfirm(false)}>Huỷ</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={confirmSave}>Xác nhận</button>
             </div>
          </div>
        </div>
      )}

      {/* PASSWORD CHANGE CONFIRMATION MODAL */}
      {showPassConfirmFinal && (
        <div className="modal-overlay visible" style={{ zIndex: 1210 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
             <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Xác nhận đổi mật khẩu</h3>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Hành động này sẽ thay đổi mật khẩu đăng nhập của bạn. Bạn vẫn muốn tiếp tục?</p>
             <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowPassConfirmFinal(false)}>Huỷ</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={confirmPasswordChange}>Xác nhận</button>
             </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div className={`toast-container ${toast.visible ? 'visible' : ''}`} style={{ 
        position: 'fixed', 
        top: '24px', 
        right: '24px', 
        zIndex: 2000, 
        transform: toast.visible ? 'translateX(0)' : 'translateX(120%)', 
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        pointerEvents: toast.visible ? 'auto' : 'none'
      }}>
        <div style={{ 
          background: 'var(--bg-card)', 
          backdropFilter: 'blur(12px)',
          borderLeft: `4px solid ${toast.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'}`,
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: '300px'
        }}>
          {toast.type === 'success' ? (
            <CheckCircle color="var(--color-success)" size={24} />
          ) : (
            <AlertCircle color="var(--color-danger)" size={24} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
              {toast.type === 'success' ? 'Thành công' : 'Lỗi'}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{toast.message}</div>
          </div>
          <button onClick={() => setToast({ ...toast, visible: false })} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
