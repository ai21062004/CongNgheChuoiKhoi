// ============================================
// Sidebar Navigation Component
// ============================================
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Upload, FolderOpen, Shield, ScrollText,
  Search, User, Settings, LogOut, Database
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

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/data" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <FolderOpen size={20} className="sidebar-link-icon" />
            <span>Dữ liệu</span>
          </NavLink>

          <NavLink to="/data/upload" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Upload size={20} className="sidebar-link-icon" />
            <span>Upload</span>
          </NavLink>

          <span className="sidebar-section-label">Blockchain</span>

          <NavLink to="/access" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Shield size={20} className="sidebar-link-icon" />
            <span>Quyền truy cập</span>
            {unreadCount > 0 && <span className="sidebar-link-badge">{unreadCount}</span>}
          </NavLink>

          <NavLink to="/audit" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <ScrollText size={20} className="sidebar-link-icon" />
            <span>Audit Log</span>
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

          <button className="sidebar-link" onClick={handleLogout}>
            <LogOut size={20} className="sidebar-link-icon" />
            <span>Đăng xuất</span>
          </button>
        </nav>

        {/* User info footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={() => { navigate('/profile'); onClose(); }}>
            <div className="sidebar-user-avatar">
              {user ? getInitials(user.name) : '?'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Guest'}</div>
              <div className="sidebar-user-role">{isAdmin ? 'Quản trị viên' : 'Người dùng'}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
