// ============================================
// Data Management - Detail Page
// ============================================
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, Shield, Clock, ExternalLink, Hash, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockDataItems, mockAccessGrants, mockAuditLogs } from '../../services/mockData';
import { formatFileSize, formatDate, getDataTypeInfo, truncateCID } from '../../utils/helpers';
import '../shared.css';

export default function DataDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'info' | 'access' | 'audit'>('info');

  const data = mockDataItems.find(d => d.id === id) || mockDataItems[0];
  const accessList = mockAccessGrants.filter(g => g.dataId === data.id);
  const auditLogs = mockAuditLogs.filter(log => log.dataId === data.id);
  const typeInfo = getDataTypeInfo(data.dataType);

  return (
    <div className="detail-page">
      <div className="detail-header">
        <div>
          <div className="detail-title">{data.title}</div>
          <div className="detail-meta">
            <span className="badge" style={{ background: typeInfo.color + '22', color: typeInfo.color }}>
              {typeInfo.label}
            </span>
            <div className="detail-meta-item">
              <Clock size={16} /> Uploaded: {formatDate(data.uploadedAt)}
            </div>
            <div className="detail-meta-item">
              <FileText size={16} /> File: {data.fileName} ({formatFileSize(data.fileSize)})
            </div>
            {data.integrityValid ? (
              <div className="detail-meta-item" style={{ color: 'var(--color-success)' }}>
                <CheckCircle size={16} /> Toàn vẹn dữ liệu: Hợp lệ
              </div>
            ) : (
              <div className="detail-meta-item" style={{ color: 'var(--color-danger)' }}>
                <AlertTriangle size={16} /> Toàn vẹn dữ liệu: Có thay đổi!
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary">
            <Shield size={18} /> Cấp quyền
          </button>
          <button className="btn btn-primary" disabled={!data.integrityValid}>
            <Download size={18} /> Tải xuống
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Thông tin chi tiết
        </button>
        <button
          className={`tab ${activeTab === 'access' ? 'active' : ''}`}
          onClick={() => setActiveTab('access')}
        >
          Quyền truy cập <span className="tab-badge">{accessList.length}</span>
        </button>
        <button
          className={`tab ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          Lịch sử Audit
        </button>
      </div>

      {activeTab === 'info' && (
        <div className="detail-grid">
          <div className="detail-card">
            <div className="detail-card-header">Metadata chung</div>
            <div className="detail-card-body">
              <div className="detail-field">
                <div className="detail-field-label">Mô tả</div>
                <div className="detail-field-value">{data.description || 'Không có mô tả'}</div>
              </div>
              <div className="detail-field">
                <div className="detail-field-label">Người sở hữu</div>
                <div className="detail-field-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10 }}>
                    {data.ownerName.charAt(0)}
                  </div>
                  {data.ownerName}
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>({data.ownerWallet})</span>
                </div>
              </div>
              <div className="detail-field">
                <div className="detail-field-label">Trạng thái</div>
                <div className="detail-field-value">
                  {data.status === 'active' ? (
                    <span style={{ color: 'var(--color-success)' }}>Hoạt động</span>
                  ) : <span style={{ color: 'var(--color-warning)' }}>Đã ẩn</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">Blockchain Record</div>
            <div className="detail-card-body">
              <div className="detail-field">
                <div className="detail-field-label">IPFS CID</div>
                <div className="detail-field-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-xs)', background: 'var(--bg-input)', padding: 8, borderRadius: 4, display: 'flex', justifyContent: 'space-between' }}>
                  {truncateCID(data.cid, 12)}
                  <a href={`#`} style={{ color: 'var(--color-primary)' }}><ExternalLink size={14} /></a>
                </div>
              </div>
              <div className="detail-field">
                <div className="detail-field-label">Data Hash (SHA-256)</div>
                <div className="detail-field-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-xs)', background: 'var(--bg-input)', padding: 8, borderRadius: 4 }}>
                  <div className="truncate">{data.metadataHash}</div>
                </div>
              </div>
              <div className="detail-field">
                <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  <Hash size={14} /> View on BlockExplorer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'access' && (
        <div className="detail-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Người được cấp</th>
                <th>Quyền</th>
                <th>Trạng thái</th>
                <th>Ngày cấp</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {accessList.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-tertiary)' }}>Chưa cấp quyền cho ai</td></tr>
              ) : (
                accessList.map(grant => (
                  <tr key={grant.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{grant.grantedToName}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{grant.grantedTo}</div>
                    </td>
                    <td>
                      {grant.permissions.join(', ').toUpperCase()}
                    </td>
                    <td>
                      <span className={`badge ${grant.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {grant.status === 'active' ? 'Đang hiệu lực' : 'Đã thu hồi'}
                      </span>
                    </td>
                    <td>{formatDate(grant.grantedAt)}</td>
                    <td>
                      {grant.status === 'active' && (
                        <button className="btn btn-danger btn-sm">Thu hồi</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="detail-card" style={{ padding: 'var(--space-6)' }}>
          <div className="timeline">
            {auditLogs.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)' }}>Chưa có log nào</div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <div className="timeline-action">
                        {log.action === 'upload' && '📤 Upload file'}
                        {log.action === 'access' && '👁️ Truy cập'}
                        {log.action === 'grant_access' && '🔑 Cấp quyền'}
                        {log.action === 'revoke_access' && '🚫 Thu hồi'}
                        {log.action === 'accept_access' && '✅ Chấp nhận quyền'}
                      </div>
                      <div className="timeline-time">{formatDate(log.timestamp)}</div>
                    </div>
                    <div className="timeline-details">
                      Bởi <strong>{log.userName}</strong>: {log.details}
                    </div>
                    <div className="timeline-tx">
                      Tx: <a href="#">{log.txHash}</a> | Block: {log.blockNumber}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
