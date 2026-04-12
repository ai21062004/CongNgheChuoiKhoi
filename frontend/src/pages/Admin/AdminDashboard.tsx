// ============================================
// Admin Dashboard Page
// ============================================
import { useState } from 'react';
import { Users, Database, Activity, AlertOctagon, Lock, Unlock, EyeOff } from 'lucide-react';
import { mockAdminStats, mockUsers, mockDataItems } from '../../services/mockData';
import { formatDate } from '../../utils/helpers';
import '../shared.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'data' | 'system'>('users');
  const stats = mockAdminStats;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Quản trị hệ thống</h2>
          <p>Giám sát toàn bộ hoạt động mạng lưới</p>
        </div>
      </div>

      <div className="dashboard-stats stagger-children">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalUsers}</div>
          <div className="stat-card-label">Tổng Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}>
              <Database size={20} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalData}</div>
          <div className="stat-card-label">Dữ liệu hệ thống</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              <Activity size={20} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalTransactions}</div>
          <div className="stat-card-label">Tổng Smart Contract Txs</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
              <AlertOctagon size={20} />
            </div>
          </div>
          <div className="stat-card-value">{stats.flaggedData}</div>
          <div className="stat-card-label">Cảnh báo vi phạm</div>
        </div>
      </div>

      <div className="tabs" style={{ marginTop: 'var(--space-8)' }}>
        <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          Quản lý người dùng
        </button>
        <button className={`tab ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>
          Toàn bộ dữ liệu
        </button>
        <button className={`tab ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
          Tham số cốt lõi
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="detail-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Ví Address</th>
                <th>Phân quyền</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td className="mono" style={{ fontSize: 'var(--font-xs)' }}>{u.walletAddress?.slice(0,10)}...</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    {u.isLocked ? (
                      <span className="badge badge-danger">Đã khoá</span>
                    ) : (
                      <span className="badge badge-success">Hoạt động</span>
                    )}
                  </td>
                  <td>
                    {u.role !== 'admin' && (
                      u.isLocked ? (
                        <button className="btn btn-success btn-sm"><Unlock size={14} style={{ marginRight: 4 }}/> Mở khoá</button>
                      ) : (
                        <button className="btn btn-danger btn-sm"><Lock size={14} style={{ marginRight: 4 }}/> Khoá</button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="detail-card">
           <table className="data-table">
            <thead>
              <tr>
                <th>Dữ liệu</th>
                <th>Chủ sở hữu</th>
                <th>CID</th>
                <th>Trạng thái</th>
                <th>Hành động Admin</th>
              </tr>
            </thead>
            <tbody>
              {mockDataItems.map(d => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 500 }}>{d.title}</td>
                  <td>{d.ownerName}</td>
                  <td className="mono" style={{ fontSize: 'var(--font-xs)' }}>{d.cid.slice(0, 10)}...</td>
                  <td>
                    {d.status === 'active' ? (
                      <span className="badge badge-success">Hiển thị</span>
                    ) : (
                      <span className="badge badge-warning">Đã ẩn</span>
                    )}
                  </td>
                  <td>
                    {d.status === 'active' ? (
                       <button className="btn btn-warning btn-sm" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)', border: '1px solid rgba(245, 158, 11, 0.3)' }}><EyeOff size={14} style={{ marginRight: 4 }}/> Gỡ bỏ (Force Hide)</button>
                    ) : (
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Đã bị ẩn khỏi SC</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="card-grid">
           <div className="detail-card">
              <div className="detail-card-header">Smart Contracts Config</div>
              <div className="detail-card-body">
                 <div className="form-field">
                    <label>Registry Contract Address</label>
                    <input type="text" value="0x123ab456cd..." readOnly />
                 </div>
                 <div className="form-field">
                    <label>Access Control Contract</label>
                    <input type="text" value="0x987zy654xw..." readOnly />
                 </div>
                 <button className="btn btn-primary">Cập nhật (Yêu cầu chữ ký)</button>
              </div>
           </div>
           
           <div className="detail-card">
              <div className="detail-card-header">Faucet System (Token)</div>
              <div className="detail-card-body">
                 <div className="form-field">
                    <label>Lượng Token thưởng User mới</label>
                    <input type="number" defaultValue="100" />
                 </div>
                 <div style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--font-sm)' }}>
                    Quỹ Faucet hiện tại: <strong>45,000 MTK</strong>
                 </div>
                 <button className="btn btn-primary">Lưu cấu hình</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
