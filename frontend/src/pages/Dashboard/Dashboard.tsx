// ============================================
// Dashboard Page 
// ============================================
import { Link } from 'react-router-dom';
import {
  FolderOpen, Share2, Clock, HardDrive, Shield, AlertTriangle,
  Upload, Search, Plus
} from 'lucide-react';
import { mockDashboardStats, mockDataItems, mockAccessRequests } from '../../services/mockData';
import { formatFileSize, formatRelativeTime, getDataTypeInfo, getStatusInfo } from '../../utils/helpers';
import './Dashboard.css';

export default function Dashboard() {
  const stats = mockDashboardStats;
  const recentData = mockDataItems.slice(0, 4);
  const pendingRequests = mockAccessRequests.filter(r => r.status === 'pending');

  return (
    <div className="dashboard">
      {/* Stats */}
      <div className="dashboard-stats stagger-children">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <FolderOpen size={20} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalFiles}</div>
          <div className="stat-card-label">Tổng số file</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}>
              <Share2 size={20} />
            </div>
          </div>
          <div className="stat-card-value">{stats.sharedFiles}</div>
          <div className="stat-card-label">File được chia sẻ</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-card-value">{stats.pendingRequests}</div>
          <div className="stat-card-label">Yêu cầu chờ duyệt</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              <HardDrive size={20} />
            </div>
          </div>
          <div className="stat-card-value">{formatFileSize(stats.storageUsed)}</div>
          <div className="stat-card-label">Dung lượng sử dụng</div>
        </div>

      </div>

      {/* Pending Requests + Recent Data */}
      <div className="dashboard-grid">
        {/* Pending Requests */}
        <div className="dashboard-section dashboard-section-full">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Yêu cầu truy cập ({pendingRequests.length})</h2>
            <Link to="/access" className="dashboard-section-action">Xem tất cả</Link>
          </div>
          {pendingRequests.length === 0 ? (
            <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              Không có yêu cầu nào
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Người yêu cầu</th>
                  <th>Dữ liệu</th>
                  <th>Quyền</th>
                  <th>Thời gian yêu cầu</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map(req => (
                  <tr key={req.id}>
                    <td>{req.requesterName}</td>
                    <td className="truncate" style={{ maxWidth: 150 }}>{req.dataTitle}</td>
                    <td>
                      {req.permissions.map(p => (
                        <span key={p} className="badge badge-info" style={{ marginRight: 4 }}>
                          {p === 'read' ? 'Xem' : 'Tải'}
                        </span>
                      ))}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatRelativeTime(req.requestedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Uploads */}
        <div className="dashboard-section dashboard-section-full">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Dữ liệu gần đây</h2>
            <Link to="/data" className="dashboard-section-action">Xem tất cả</Link>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Loại</th>
                <th>Kích thước</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {recentData.map(item => {
                const typeInfo = getDataTypeInfo(item.dataType);
                return (
                  <tr key={item.id}>
                    <td>
                      <Link to={`/data/${item.id}`} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {item.title}
                      </Link>
                    </td>
                    <td>
                      <span className="badge" style={{ background: typeInfo.color + '22', color: typeInfo.color }}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td>{formatFileSize(item.fileSize)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatRelativeTime(item.uploadedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
