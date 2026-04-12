// ============================================
// Header Component
// ============================================
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Wallet } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { truncateAddress, formatRelativeTime, getNotificationColor } from '../../utils/helpers';
import './Header.css';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { address, isConnected, isConnecting, connect } = useWallet();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifClick = (notifId: string, link?: string) => {
    markAsRead(notifId);
    if (link) {
      navigate(link);
      setShowNotifs(false);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right">
        {/* Wallet */}
        <button
          className={`header-wallet-btn ${isConnected ? 'connected' : ''}`}
          onClick={!isConnected ? connect : undefined}
          disabled={isConnecting}
        >
          {isConnected ? (
            <>
              <span className="wallet-dot" />
              <span>{truncateAddress(address || '', 4)}</span>
            </>
          ) : (
            <>
              <Wallet size={16} />
              <span>{isConnecting ? 'Đang kết nối...' : 'Kết nối ví'}</span>
            </>
          )}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button className="header-notif-btn" onClick={() => setShowNotifs(!showNotifs)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="header-notif-badge">{unreadCount}</span>}
          </button>

          {showNotifs && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <span className="notif-dropdown-title">Thông báo</span>
                {unreadCount > 0 && (
                  <button className="notif-mark-all" onClick={markAllAsRead}>
                    Đánh dấu tất cả đã đọc
                  </button>
                )}
              </div>
              <div className="notif-dropdown-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">Không có thông báo</div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`notif-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => handleNotifClick(notif.id, notif.link)}
                    >
                      <div
                        className="notif-item-dot"
                        style={{ background: getNotificationColor(notif.type) }}
                      />
                      <div className="notif-item-content">
                        <div className="notif-item-title">{notif.title}</div>
                        <div className="notif-item-message">{notif.message}</div>
                        <div className="notif-item-time">{formatRelativeTime(notif.createdAt)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
