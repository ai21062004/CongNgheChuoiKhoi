import { useState, useEffect } from 'react';
import { Search, FileText, Download, Shield, X, ShieldAlert } from 'lucide-react';
import { mockDataItems } from '../../services/mockData';
import { formatFileSize, formatRelativeTime, getDataTypeInfo } from '../../utils/helpers';
import '../shared.css';

export default function SearchData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDataId, setSelectedDataId] = useState<string | null>(null);
  const [requestPermissions, setRequestPermissions] = useState<string[]>([]);
  const [note, setNote] = useState('');

  // Lấy dữ liệu của người dùng khác (không phải user-001)
  const otherUsersData = mockDataItems.filter(item => item.ownerId !== 'user-001');

  const filteredData = otherUsersData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.dataType === filterType;
    return matchesSearch && matchesType;
  });

  const selectedData = mockDataItems.find(d => d.id === selectedDataId);

  useEffect(() => {
    if (showRequestModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showRequestModal]);

  const handleRequestSubmit = () => {
    if (requestPermissions.length === 0) {
      alert('Vui lòng chọn ít nhất một quyền truy cập!');
      return;
    }
    // TODO: Xử lý thêm logic gửi yêu cầu (gọi API/Smart Contract)
    alert('Đã gửi yêu cầu quyền truy cập thành công!');
    setShowRequestModal(false);
    setSelectedDataId(null);
    setRequestPermissions([]);
    setNote('');
  };

  const handleCancel = () => {
    setShowRequestModal(false);
    setSelectedDataId(null);
    setRequestPermissions([]);
    setNote('');
  };

  return (
    <div className="animate-fade-in">


      <div className="filter-bar">
        <div className="filter-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="filter-input"
            placeholder="Tìm kiếm theo tên file hoặc dự án..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Tất cả loại file</option>
          <option value="document">Tài liệu</option>
          <option value="image">Hình ảnh</option>
          <option value="video">Video</option>
          <option value="spreadsheet">Bảng tính</option>
        </select>
      </div>

      {filteredData.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search size={32} />
          </div>
          <h3>Không tìm thấy dữ liệu</h3>
          <p>Không có file nào chia sẻ khớp với từ khoá tìm kiếm của bạn.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Dữ liệu / Chủ sở hữu</th>
              <th>Loại</th>
              <th>Kích thước</th>
              <th>Thời gian</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => {
              const typeInfo = getDataTypeInfo(item.dataType);
              return (
                <tr key={item.id}>
                  <td>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                      Người chia sẻ: {item.ownerName}
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: typeInfo.color + '22', color: typeInfo.color }}>
                      {typeInfo.label}
                    </span>
                  </td>
                  <td>{formatFileSize(item.fileSize)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{formatRelativeTime(item.uploadedAt)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="data-table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => {
                          setSelectedDataId(item.id);
                          setShowRequestModal(true);
                        }}
                      >
                        <ShieldAlert size={16} style={{ marginRight: '6px' }} />
                        Yêu cầu truy cập
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* REQUEST ACCESS MODAL */}
      {showRequestModal && selectedData && (
        <div className="modal-overlay visible" style={{ zIndex: 1100 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', width: '90%', padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)' }}>
             <h3 style={{ marginBottom: '8px', fontSize: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Yêu cầu quyền truy cập
                <button type="button" onClick={handleCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20}/></button>
             </h3>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                Dữ liệu: <strong style={{ color: 'var(--text-primary)' }}>{selectedData.title}</strong>
                <br />
                Người chia sẻ: <strong style={{ color: 'var(--text-primary)' }}>{selectedData.ownerName}</strong>
             </p>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                <div style={{ fontWeight: 500 }}>Chọn quyền mong muốn:</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                   <input 
                      type="checkbox" 
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                      checked={requestPermissions.includes('read')} 
                      onChange={e => {
                         if (e.target.checked) setRequestPermissions([...requestPermissions, 'read']);
                         else setRequestPermissions(requestPermissions.filter(p => p !== 'read'));
                      }} 
                   />
                   <span style={{ fontSize: '1rem' }}>Quyền Xem (Read)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                   <input 
                      type="checkbox" 
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                      checked={requestPermissions.includes('download')} 
                      onChange={e => {
                         if (e.target.checked) setRequestPermissions([...requestPermissions, 'download']);
                         else setRequestPermissions(requestPermissions.filter(p => p !== 'download'));
                      }} 
                   />
                   <span style={{ fontSize: '1rem' }}>Quyền Tải xuống (Download)</span>
                </label>
             </div>

             <div className="form-field">
                <label htmlFor="note">Ghi chú (tuỳ chọn)</label>
                <textarea 
                  id="note" 
                  value={note} 
                  onChange={e => setNote(e.target.value)} 
                  placeholder="Lý do bạn cần truy cập file này..." 
                  style={{ minHeight: '80px', width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.9rem' }} 
                />
             </div>

             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button className="btn btn-secondary" onClick={handleCancel}>Huỷ</button>
                <button className="btn btn-primary" onClick={handleRequestSubmit}>Xác nhận</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
