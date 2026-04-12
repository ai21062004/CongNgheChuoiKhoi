// ============================================
// App Layout - Main layout wrapper for authenticated pages
// ============================================
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './AppLayout.css';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/data': 'Quản lý dữ liệu',
  '/data/upload': 'Upload dữ liệu',
  '/access': 'Quyền truy cập',
  '/audit': 'Audit Log',
  '/search': 'Tìm kiếm',
  '/profile': 'Hồ sơ cá nhân',
  '/admin': 'Quản trị hệ thống',
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    // Check exact match first
    if (pageTitles[location.pathname]) return pageTitles[location.pathname];
    // Check prefix match for dynamic routes
    if (location.pathname.startsWith('/data/')) return 'Chi tiết dữ liệu';
    return 'BlockData';
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header title={getTitle()} onMenuClick={() => setSidebarOpen(true)} />
      <main className="app-main">
        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
