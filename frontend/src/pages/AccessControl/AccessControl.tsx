// ============================================
// Access Control Page
// ============================================
import { useState, useEffect } from 'react';
import { Shield, Key, FilePlus, UserCheck, Search, Filter, X, Download, Clock, FileText } from 'lucide-react';
import { mockAccessRequests, mockAccessGrants, mockDataItems } from '../../services/mockData';
import { formatDate, getStatusInfo, getDataTypeInfo, formatFileSize } from '../../utils/helpers';
import '../shared.css';

export default function AccessControl() {
  const [activeTab, setActiveTab] = useState<'shared-with-me' | 'requests'>('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [permissionFilter, setPermissionFilter] = useState('all');

  // Modal State
  const [viewDataId, setViewDataId] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Lấy dữ liệu cho từng tab
  const pendingRequests = mockAccessRequests.filter(r => {
    if (r.status !== 'pending') return false;
    if (searchTerm && !r.dataTitle.toLowerCase().includes(searchTerm.toLowerCase()) && !r.requesterName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (permissionFilter !== 'all' && !r.permissions.includes(permissionFilter as 'read' | 'download')) return false;
    return true;
  });
  const sharedWithMe = mockAccessGrants.filter(g => g.grantedTo === 'user-001' && g.status === 'active');

  const selectedData = mockDataItems.find(d => d.id === viewDataId);
  const selectedGrant = mockAccessGrants.find(g => g.dataId === viewDataId && g.grantedTo === 'user-001' && g.status === 'active');

  useEffect(() => {
    if (showViewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showViewModal]);

  const renderFilePreview = (data: any) => {
    switch (data.dataType) {
      case 'image':
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <img 
              src={`https://picsum.photos/seed/${data.id}/1200/800`} 
              alt={data.title} 
              style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', objectFit: 'contain', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
            />
          </div>
        );
      case 'video':
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
             <video width="100%" controls poster={`https://picsum.photos/seed/${data.id}/1200/800`} style={{ maxHeight: '100%' }}>
                 <source src="#" type="video/mp4" />
                 Trình duyệt không hỗ trợ thẻ video.
             </video>
          </div>
        );
      case 'document':
        return (
          <div style={{ width: '100%', height: '100%', padding: '32px', background: '#f3f4f6', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
            <div style={{ width: '100%', maxWidth: '800px', minHeight: '800px', background: 'white', padding: '48px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '4px' }}>
               <h3 style={{ fontSize: '24px', marginBottom: '32px', color: '#111827' }}>{data.title}</h3>
               <div style={{ height: '14px', width: '100%', background: '#e5e7eb', marginBottom: '16px', borderRadius: '2px' }}></div>
               <div style={{ height: '14px', width: '90%', background: '#e5e7eb', marginBottom: '16px', borderRadius: '2px' }}></div>
               <div style={{ height: '14px', width: '95%', background: '#e5e7eb', marginBottom: '16px', borderRadius: '2px' }}></div>
               <div style={{ height: '14px', width: '85%', background: '#e5e7eb', marginBottom: '32px', borderRadius: '2px' }}></div>
               
               <div style={{ height: '240px', width: '100%', background: '#e5e7eb', marginBottom: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Hình ảnh / Biểu đồ</div>
               
               <div style={{ height: '14px', width: '100%', background: '#e5e7eb', marginBottom: '16px', borderRadius: '2px' }}></div>
               <div style={{ height: '14px', width: '88%', background: '#e5e7eb', marginBottom: '16px', borderRadius: '2px' }}></div>
            </div>
          </div>
        );
      case 'spreadsheet':
        return (
           <div style={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', background: 'white' }}>
             <div style={{ display: 'flex', background: '#f9fafb', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #e5e7eb' }}>
               <div style={{ flex: '0 0 50px', background: '#f3f4f6', borderRight: '1px solid #d1d5db' }}></div>
               {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(col => (
                 <div key={col} style={{ flex: '0 0 120px', padding: '8px', borderRight: '1px solid #e5e7eb', textAlign: 'center', fontWeight: 600, fontSize: '12px', color: '#4b5563' }}>{col}</div>
               ))}
             </div>
             {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(row => (
               <div key={row} style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                 <div style={{ flex: '0 0 50px', padding: '12px 8px', background: '#f9fafb', borderRight: '1px solid #d1d5db', textAlign: 'center', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{row}</div>
                 {[1,2,3,4,5,6,7].map(col => (
                   <div key={col} style={{ flex: '0 0 120px', padding: '12px 8px', borderRight: '1px solid #e5e7eb', fontSize: '13px', color: '#111827' }}>
                      {row === 1 ? `Header ${col}` : `Data ${row}-${col}`}
                   </div>
                 ))}
               </div>
             ))}
           </div>
        );
      case 'audio':
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', background: 'var(--bg-glass)' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '48px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🎵</div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>{data.title}</div>
            <audio controls style={{ width: '400px', maxWidth: '100%' }}>
              <source src="#" type="audio/mpeg" />
            </audio>
          </div>
        );
      default:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', color: 'var(--text-tertiary)', background: 'var(--bg-card)' }}>
             <FileText size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
             <p>Định dạng dữ liệu không có chế độ xem trước khả dụng.</p>
          </div>
        );
    }
  };

  return (
    <div className="animate-fade-in">


      <div className="tabs">
        <button
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Yêu cầu chờ duyệt 
          {pendingRequests.length > 0 && <span className="tab-badge" style={{ background: 'var(--color-danger)', color: 'white' }}>{pendingRequests.length}</span>}
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
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Tìm kiếm..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={permissionFilter}
          onChange={e => setPermissionFilter(e.target.value)}
        >
          <option value="all">Tất cả quyền</option>
          <option value="read">Quyền Xem</option>
          <option value="download">Quyền Tải xuống</option>
        </select>
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
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setViewDataId(grant.dataId);
                          setShowViewModal(true);
                        }}
                      >Truy cập ngay</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* VIEW DATA FULL MODAL */}
      {showViewModal && selectedData && (
        <div className="modal-overlay visible" style={{ zIndex: 1100 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '1200px', width: '95%', height: '90vh', display: 'flex', flexDirection: 'column', padding: 0, backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden' }}>
            
            {/* Header Modal */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--bg-card)' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{selectedData.title}</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)', alignItems: 'center' }}>
                  <span className="badge" style={{ background: getDataTypeInfo(selectedData.dataType).color + '22', color: getDataTypeInfo(selectedData.dataType).color }}>
                    {getDataTypeInfo(selectedData.dataType).label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> Thời gian: {formatDate(selectedData.uploadedAt)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={14} /> File: {selectedData.fileName} ({formatFileSize(selectedData.fileSize)})
                  </div>
                  <div>Chủ sở hữu: <strong>{selectedData.ownerName}</strong></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {selectedGrant?.permissions.includes('download') && (
                  <button className="btn btn-primary">
                    <Download size={18} style={{ marginRight: '6px' }} />
                    Tải xuống
                  </button>
                )}
                <button type="button" onClick={() => setShowViewModal(false)} style={{ background: 'var(--bg-input)', border: 'none', color: 'var(--text-primary)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <X size={20}/>
                </button>
              </div>
            </div>

            {/* Body Modal */}
            <div style={{ flex: 1, overflow: 'hidden', background: 'var(--bg-secondary)', position: 'relative' }}>
               {selectedGrant?.permissions.includes('read') ? (
                 renderFilePreview(selectedData)
               ) : (
                 <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>
                    <Shield size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p>Bạn không có quyền Xem (Read) cho dữ liệu này. Hãy yêu cầu chủ sở hữu cấp thêm quyền bằng cách liên hệ với họ!</p>
                 </div>
               )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
