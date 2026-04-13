// ============================================
// Sidebar Navigation Component
// ============================================
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Upload, FolderOpen, Shield, ScrollText,
  Search, User, Settings, LogOut, Database, X, LogOut as LogOutIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (showLogoutConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showLogoutConfirm]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutConfirm(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Database size={20} />
          </div>
          <span className="sidebar-logo-text">BlockData</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Chính</span>
          
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <LayoutDashboard size={20} className="sidebar-link-icon" />
            <span>Tổng quan</span>
          </NavLink>

          <NavLink to="/data" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <FolderOpen size={20} className="sidebar-link-icon" />
            <span>Dữ liệu</span>
          </NavLink>

          <NavLink to="/search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Search size={20} className="sidebar-link-icon" />
            <span>Tìm kiếm</span>
          </NavLink>

          <span className="sidebar-section-label">Blockchain</span>

        <NavLink to="/access" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Shield size={20} className="sidebar-link-icon" />
            <span>Quyền truy cập</span>
            {unreadCount > 0 && <span className="sidebar-link-badge">{unreadCount}</span>}
          </NavLink>

          {isAdmin && (
            <>
              <span className="sidebar-section-label">Admin</span>
              <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
                <Settings size={20} className="sidebar-link-icon" />
                <span>Quản trị</span>
              </NavLink>
            </>
          )}

          <span className="sidebar-section-label">Tài khoản</span>

          <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <User size={20} className="sidebar-link-icon" />
            <span>Hồ sơ</span>
          </NavLink>


        </nav>

        {/* Logout footer */}
        <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border-color)', padding: 'var(--space-4)' }}>
          <button className="sidebar-link" onClick={handleLogoutClick} style={{ width: '100%', marginBottom: 0 }}>
            <LogOut size={20} className="sidebar-link-icon" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="modal-overlay visible" style={{ zIndex: 1200 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
             <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <LogOutIcon size={30} />
             </div>
             
             <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Xác nhận đăng xuất</h3>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?</p>

             <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowLogoutConfirm(false)}>Huỷ</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={confirmLogout}>Đăng xuất</button>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
