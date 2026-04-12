// ============================================
// Access Control Page
// ============================================
import { useState } from 'react';
import { Shield, Key, FilePlus, UserCheck, Search, Filter } from 'lucide-react';
import { mockAccessRequests, mockAccessGrants, mockDataItems } from '../../services/mockData';
import { formatDate, getStatusInfo } from '../../utils/helpers';
import '../shared.css';

export default function AccessControl() {
  const [activeTab, setActiveTab] = useState<'my-grants' | 'shared-with-me' | 'requests'>('requests');

  // Lấy dữ liệu cho từng tab
  const pendingRequests = mockAccessRequests.filter(r => r.status === 'pending');
  const sharedWithMe = mockAccessGrants.filter(g => g.grantedTo === 'user-001' && g.status === 'active');
  const myGrants = mockAccessGrants.filter(g => g.grantedBy === 'user-001');

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Quản lý quyền truy cập</h2>
          <p>Cấp, thu hồi quyền và quản lý yêu cầu truy cập dữ liệu</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary">
            <Key size={18} /> Cấp quyền mới
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Yêu cầu chờ duyệt 
          {pendingRequests.length > 0 && <span className="tab-badge" style={{ background: 'var(--color-danger)', color: 'white' }}>{pendingRequests.length}</span>}
        </button>
        <button
          className={`tab ${activeTab === 'my-grants' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-grants')}
        >
          Đã cấp cho người khác
        </button>
        <button
          className={`tab ${activeTab === 'shared-with-me' ? 'active' : ''}`}
          onClick={() => setActiveTab('shared-with-me')}
        >
          Được chia sẻ với tôi <span className="tab-badge">{sharedWithMe.length}</span>
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-input-wrapper">
          <Search size={18} />
          <input type="text" className="filter-input" placeholder="Tìm kiếm..." />
        </div>
        <button className="btn btn-secondary">
          <Filter size={18} /> Bộ lọc
        </button>
      </div>

      {activeTab === 'requests' && (
        <div className="card-grid">
          {pendingRequests.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
               <div className="empty-state-icon"><UserCheck size={32} /></div>
               <h3>Không có yêu cầu chờ duyệt</h3>
            </div>
          ) : (
            pendingRequests.map(req => (
              <div key={req.id} className="detail-card">
                <div className="detail-card-body" style={{ padding: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                    <div className="badge badge-warning">Chờ duyệt</div>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{formatDate(req.requestedAt)}</span>
                  </div>
                  <h3 style={{ fontSize: 'var(--font-base)', marginBottom: 'var(--space-1)' }}>{req.dataTitle}</h3>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                    Người yêu cầu: <strong>{req.requesterName}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-input)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)', fontStyle: 'italic', marginBottom: 'var(--space-4)' }}>
                    "{req.message}"
                  </div>
                  <div style={{ fontSize: 'var(--font-sm)', marginBottom: 'var(--space-4)' }}>
                    Quyền yêu cầu:{' '}
                    {req.permissions.map(p => (
                      <span key={p} className="badge badge-info" style={{ marginLeft: 4 }}>
                        {p === 'read' ? 'Xem' : 'Tải'}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }}>Chấp nhận</button>
                    <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}>Từ chối</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'my-grants' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Dữ liệu</th>
              <th>Cấp cho</th>
              <th>Quyền</th>
              <th>Trạng thái</th>
              <th>Ngày cấp</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {myGrants.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>Chưa cấp quyền cho ai</td></tr>
            ) : myGrants.map(grant => {
              const statusInfo = getStatusInfo(grant.status);
              return (
                <tr key={grant.id}>
                  <td style={{ fontWeight: 500 }}>{grant.dataTitle}</td>
                  <td>{grant.grantedToName}</td>
                  <td>{grant.permissions.join(', ').toUpperCase()}</td>
                  <td>
                    <span className="badge" style={{ background: statusInfo.color + '22', color: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td>{formatDate(grant.grantedAt)}</td>
                  <td>
                    {grant.status === 'active' && (
                      <button className="btn btn-danger btn-sm">Thu hồi</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {activeTab === 'shared-with-me' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Dữ liệu</th>
              <th>Chủ sở hữu</th>
              <th>Quyền của tôi</th>
              <th>Ngày cấp</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sharedWithMe.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>Chưa có file nào được chia sẻ</td></tr>
            ) : sharedWithMe.map(grant => {
              const item = mockDataItems.find(d => d.id === grant.dataId);
              return (
                <tr key={grant.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{grant.dataTitle}</td>
                  <td>{item?.ownerName}</td>
                  <td>
                    {grant.permissions.map(p => (
                      <span key={p} className="badge badge-info" style={{ marginRight: 4 }}>
                        {p === 'read' ? 'Xem' : 'Tải'}
                      </span>
                    ))}
                  </td>
                  <td>{formatDate(grant.grantedAt)}</td>
                  <td>
                    <div className="data-table-actions">
                      <button className="btn btn-primary btn-sm">Truy cập ngay</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
