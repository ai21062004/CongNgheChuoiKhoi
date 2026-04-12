// ============================================
// Audit Log Page
// ============================================
import { useState } from 'react';
import { ScrollText, Search, Filter, Hash, Eye } from 'lucide-react';
import { mockAuditLogs } from '../../services/mockData';
import { formatDate, getAuditActionInfo } from '../../utils/helpers';
import '../shared.css';

export default function AuditLog() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLogs = mockAuditLogs.filter(log => 
    log.dataTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Audit Log</h2>
          <p>Lịch sử hành động không thể giả mạo trên Blockchain</p>
        </div>
        <div className="page-header-actions">
           <div className="badge badge-success" style={{ padding: '6px 12px' }}>
              <Hash size={14} style={{ marginRight: 6 }} /> Blockchain Synced
           </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-input-wrapper">
          <Search size={18} />
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Tìm kiếm transaction, user, hoặc file..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="filter-select">
          <option value="all">Tất cả hành động</option>
          <option value="upload">Upload</option>
          <option value="access">Truy cập</option>
          <option value="grant">Cấp quyền</option>
          <option value="revoke">Thu hồi quyền</option>
        </select>
        <input type="date" className="filter-input" style={{ flex: '0 1 auto' }} />
      </div>

      <div className="detail-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Hành động</th>
              <th>Bởi User</th>
              <th>Dữ liệu / Chi tiết</th>
              <th>Tx Hash</th>
              <th>Khối</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => {
              const actionInfo = getAuditActionInfo(log.action);
              return (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                    {formatDate(log.timestamp)}
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: actionInfo.color, fontWeight: 500 }}>
                      {actionInfo.icon} {actionInfo.label}
                    </span>
                  </td>
                  <td>{log.userName}</td>
                  <td>
                    {log.dataTitle && <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{log.dataTitle}</div>}
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{log.details}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="mono" style={{ color: 'var(--text-muted)' }}>{log.txHash.slice(0, 10)}...</span>
                      <a href="#" className="btn-icon" style={{ padding: 2, color: 'var(--color-primary)' }} title="View on explorer"><Eye size={14} /></a>
                    </div>
                  </td>
                  <td className="mono">{log.blockNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
