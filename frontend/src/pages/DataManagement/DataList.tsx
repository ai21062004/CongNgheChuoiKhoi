// ============================================
// Data Management - List Page
// ============================================
import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, FileText, Download, Shield, UploadCloud, X, ShieldCheck, File as FileIcon, ChevronLeft, ChevronRight, Copy, Check, CheckCircle, Share2, ToggleLeft, ToggleRight } from 'lucide-react';
import { mockDataItems, mockAccessGrants } from '../../services/mockData';
import { formatFileSize, formatRelativeTime, getDataTypeInfo, delay, formatDate, getStatusInfo } from '../../utils/helpers';
import '../shared.css';

export default function DataList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedDataIdForAccess, setSelectedDataIdForAccess] = useState<string | null>(null);
  const [editingGrantId, setEditingGrantId] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<string[]>([]);
  
  const [showStopShareConfirm, setShowStopShareConfirm] = useState(false);
  const [dataToStopShare, setDataToStopShare] = useState<any>(null);

  const selectedDataForAccess = mockDataItems.find(d => d.id === selectedDataIdForAccess);
  const myGrantsForData = mockAccessGrants.filter(g => g.dataId === selectedDataIdForAccess && g.grantedBy === 'user-001');

  // toast state
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast({ message: 'Đã sao chép mã chia sẻ!', visible: true });
  };

  useEffect(() => {
    if (showUploadModal || showAccessModal || editingGrantId || showStopShareConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showUploadModal, showAccessModal, editingGrantId]);

  // Upload modal state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dataType, setDataType] = useState('document');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredData = mockDataItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.dataType === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name);
    }
  };

  const cancelSelection = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);
    
    setUploadProgress(10);
    await delay(500);
    setUploadProgress(40);
    await delay(800);
    setUploadProgress(70);
    await delay(1000);
    setUploadProgress(100);
    await delay(300);

    setIsUploading(false);
    setShowUploadModal(false);
    
    // Reset form
    setFile(null);
    setTitle('');
    setDescription('');
    setDataType('document');
    setUploadProgress(0);
  };

  return (
    <div className="animate-fade-in">

      {showUploadModal && (
        <div className="modal-overlay visible" onClick={() => !isUploading && setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%', padding: '24px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Tải lên tài liệu mới
              {!isUploading && <button type="button" onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20}/></button>}
            </h3>
            
            <div className="detail-grid" style={{ gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
              <div>
                <form onSubmit={handleUploadSubmit}>
                  <div className="form-field">
                    <label htmlFor="title">Tiêu đề *</label>
                    <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tiêu đề dữ liệu" required disabled={isUploading} />
                  </div>

                  <div className="form-field">
                    <label htmlFor="type">Loại dữ liệu</label>
                    <select id="type" value={dataType} onChange={e => setDataType(e.target.value)} disabled={isUploading}>
                      <option value="document">Tài liệu (PDF, Word...)</option>
                      <option value="image">Hình ảnh (PNG, JPG...)</option>
                      <option value="video">Video (MP4...)</option>
                      <option value="spreadsheet">Bảng tính (Excel...)</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="desc">Mô tả (tuỳ chọn)</label>
                    <textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả nội dung file..." disabled={isUploading} style={{ minHeight: '80px' }} />
                  </div>

                  {isUploading && (
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', marginBottom: 4 }}>
                        <span>Đang xử lý...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--color-primary)', width: `${uploadProgress}%`, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)} disabled={isUploading}>
                      Huỷ
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={!file || !title || isUploading}>
                      {isUploading ? 'Đang Upload...' : 'Bắt đầu Upload'}
                    </button>
                  </div>
                </form>
              </div>

              <div>
                <div className="detail-card" style={{ marginBottom: '24px', border: 'none', background: 'var(--bg-glass)' }}>
                  <div className="detail-card-header" style={{ padding: '12px 16px', borderBottom: 'none' }}>File Dữ liệu</div>
                  <div className="detail-card-body" style={{ padding: '0 16px 16px' }}>
                    {!file ? (
                      <div className="upload-area" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} style={{ minHeight: '150px' }}>
                        <div className="upload-area-icon"><UploadCloud size={24} /></div>
                        <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>Kéo thả file</h3>
                        <p style={{ fontSize: '12px' }}>hoặc click chọn file</p>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                      </div>
                    ) : (
                      <div className="upload-file-info" style={{ padding: '12px' }}>
                        <FileIcon size={24} color="var(--color-primary)" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="truncate" style={{ fontWeight: 500, fontSize: '13px' }}>{file.name}</div>
                          <div className="upload-file-size" style={{ fontSize: '11px' }}>{formatFileSize(file.size)}</div>
                        </div>
                        {!isUploading && (
                          <button type="button" className="btn-icon" onClick={cancelSelection} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-card" style={{ border: 'none', background: 'var(--bg-glass)' }}>
                  <div className="detail-card-header" style={{ padding: '12px 16px', borderBottom: 'none' }}>Quy trình hệ thống</div>
                  <div className="detail-card-body" style={{ padding: '0 16px 16px' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <li style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <ShieldCheck size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />
                        <span>Mã hoá trực tiếp trên trình duyệt</span>
                      </li>
                      <li style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <ShieldCheck size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />
                        <span>Lưu trên mạng IPFS phi tập trung</span>
                      </li>
                      <li style={{ display: 'flex', gap: '8px' }}>
                        <ShieldCheck size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />
                        <span>Bảo vệ quyền thao tác bằng Smart Contract</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <div className="filter-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="filter-input"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
        >
          <option value="all">Tất cả loại file</option>
          <option value="document">Tài liệu</option>
          <option value="image">Hình ảnh</option>
          <option value="video">Video</option>
          <option value="spreadsheet">Bảng tính</option>
        </select>
        <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
          <Plus size={18} /> Tải lên tài liệu mới
        </button>
      </div>

      {filteredData.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FileText size={32} />
          </div>
          <h3>Không tìm thấy dữ liệu</h3>
          <p>Trống hoặc không có file nào khớp với tìm kiếm của bạn.</p>
          <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>Upload ngay</button>
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên File / Dữ liệu</th>
                <th>Loại</th>
                <th>Kích thước</th>
                <th>Thời gian</th>
                <th>Mã chia sẻ</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(item => {
                const typeInfo = getDataTypeInfo(item.dataType);
                return (
                  <tr key={item.id}>
                    <td>
                      <Link to={`/data/${item.id}`} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {item.title}
                      </Link>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                        {item.fileName}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: typeInfo.color + '22', color: typeInfo.color }}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td>{formatFileSize(item.fileSize)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatRelativeTime(item.uploadedAt)}</td>
                    <td>
                      <div 
                        onClick={() => copyToClipboard(`f2e5-${item.id.slice(-4)}-${Math.random().toString(36).slice(2, 6)}-${Date.now().toString().slice(-4)}`)}
                        style={{ 
                          background: 'var(--bg-glass)', 
                          padding: '6px 10px', 
                          borderRadius: 'var(--radius-sm)', 
                          fontSize: '11px', 
                          fontFamily: 'var(--font-mono)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: 'fit-content',
                          border: '1px solid var(--border-color)',
                          color: 'var(--color-primary)'
                        }}
                        title="Click để copy"
                      >
                        <span className="truncate" style={{ maxWidth: '80px' }}>{`f2e5-${item.id.slice(-4)}-${item.id.slice(0, 4)}`}</span>
                        <Copy size={12} />
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="data-table-actions" style={{ justifyContent: 'flex-end' }}>
                        <Link to={`/data/${item.id}`} className="btn btn-secondary btn-sm" title="Chi tiết">
                          <FileText size={16} />
                        </Link>
                        <button className="btn btn-secondary btn-sm" title="Tải xuống">
                          <Download size={16} />
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          title="Quản lý quyền"
                          onClick={() => {
                            setSelectedDataIdForAccess(item.id);
                            setShowAccessModal(true);
                          }}
                        >
                          <Shield size={16} />
                        </button>
                        <button 
                          className={`btn btn-sm ${item.status === 'active' ? 'btn-success' : 'btn-secondary'}`} 
                          title={item.status === 'active' ? 'Đang bật chia sẻ - Click để dừng' : 'Đang tắt chia sẻ - Click để bật lại'}
                          onClick={() => {
                            setDataToStopShare(item);
                            setShowStopShareConfirm(true);
                          }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            minWidth: '100px',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {item.status === 'active' ? (
                            <>
                              <ToggleRight size={18} />
                              <span style={{ fontSize: '12px' }}>Bật</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={18} />
                              <span style={{ fontSize: '12px' }}>Tắt</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Hiển thị từ {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredData.length)} trong tổng số {filteredData.length} dữ liệu
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ padding: '8px' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: '14px', fontWeight: 500 }}>
                  {currentPage} / {totalPages}
                </div>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{ padding: '8px' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ACCESS MANAGEMENT MODAL */}
      {showAccessModal && selectedDataForAccess && (
        <div className="modal-overlay visible" onClick={() => setShowAccessModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%', padding: '24px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ marginBottom: '8px', fontSize: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Quản lý quyền truy cập
              <button type="button" onClick={() => setShowAccessModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20}/></button>
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Dữ liệu: <strong>{selectedDataForAccess.title}</strong>
            </p>

            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Cấp cho</th>
                  <th>Quyền</th>
                  <th>Trạng thái</th>
                  <th>Ngày cấp</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {myGrantsForData.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>Chưa cấp quyền cho ai</td></tr>
                ) : myGrantsForData.map(grant => {
                  const statusInfo = getStatusInfo(grant.status);
                  return (
                    <tr key={grant.id}>
                      <td>{grant.grantedToName}</td>
                      <td>{grant.permissions.join(', ').toUpperCase()}</td>
                      <td>
                        <span className="badge" style={{ background: statusInfo.color + '22', color: statusInfo.color }}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>{formatDate(grant.grantedAt)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => {
                              setEditingGrantId(grant.id);
                              setEditingPermissions([...grant.permissions]);
                            }}
                          >
                            Thêm quyền
                          </button>
                          {grant.status === 'active' && (
                            <button className="btn btn-danger btn-sm">Thu hồi</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT PERMISSION SUB-MODAL */}
      {editingGrantId && (
        <div className="modal-overlay visible" style={{ zIndex: 1100 }} onClick={() => setEditingGrantId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)' }}>
             <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Thêm quyền truy cập</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                   <input 
                      type="checkbox" 
                      style={{ width: '18px', height: '18px' }}
                      checked={editingPermissions.includes('read')} 
                      onChange={e => {
                         if (e.target.checked) setEditingPermissions([...editingPermissions, 'read']);
                         else setEditingPermissions(editingPermissions.filter(p => p !== 'read'));
                      }} 
                   />
                   <span style={{ fontSize: '1rem' }}>Quyền Xem (Read)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                   <input 
                      type="checkbox" 
                      style={{ width: '18px', height: '18px' }}
                      checked={editingPermissions.includes('download')} 
                      onChange={e => {
                         if (e.target.checked) setEditingPermissions([...editingPermissions, 'download']);
                         else setEditingPermissions(editingPermissions.filter(p => p !== 'download'));
                      }} 
                   />
                   <span style={{ fontSize: '1rem' }}>Quyền Tải xuống (Download)</span>
                </label>
             </div>
             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button className="btn btn-secondary" onClick={() => setEditingGrantId(null)}>Huỷ</button>
                <button className="btn btn-primary" onClick={() => setEditingGrantId(null)}>Xác nhận</button>
             </div>
          </div>
        </div>
      )}

      {/* STOP SHARE CONFIRMATION MODAL */}
      {showStopShareConfirm && dataToStopShare && (
        <div className="modal-overlay visible" onClick={() => setShowStopShareConfirm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
             <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: dataToStopShare.status === 'active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: dataToStopShare.status === 'active' ? 'var(--color-danger)' : 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                {dataToStopShare.status === 'active' ? <ToggleRight size={30} /> : <ToggleLeft size={30} />}
             </div>
             
             <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>{dataToStopShare.status === 'active' ? 'Xác nhận dừng chia sẻ' : 'Xác nhận bật chia sẻ'}</h3>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
               Bạn có chắc chắn muốn {dataToStopShare.status === 'active' ? 'dừng' : 'bật lại'} chia sẻ file <strong>{dataToStopShare.title}</strong>? 
               {dataToStopShare.status === 'active' 
                 ? 'Mọi quyền truy cập đã cấp cho người dùng khác có thể bị ảnh hưởng.' 
                 : 'Người dùng khác sẽ có thể tìm thấy và yêu cầu quyền truy cập file này.'}
             </p>

             <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowStopShareConfirm(false)}>Huỷ</button>
                <button 
                  className={dataToStopShare.status === 'active' ? 'btn btn-danger' : 'btn btn-success'} 
                  style={{ flex: 1 }} 
                  onClick={() => {
                    setToast({ 
                      message: dataToStopShare.status === 'active' 
                        ? ` Đã dừng chia sẻ file: ${dataToStopShare.title}` 
                        : `Đã bật chia sẻ file: ${dataToStopShare.title}`, 
                      visible: true 
                    });
                    setShowStopShareConfirm(false);
                    setDataToStopShare(null);
                  }}
                >
                  {dataToStopShare.status === 'active' ? 'Xác nhận dừng' : 'Xác nhận bật'}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* SUCCESS TOAST */}
      <div className={`toast-container ${toast.visible ? 'visible' : ''}`} style={{ 
        position: 'fixed', 
        top: '24px', 
        right: '24px', 
        zIndex: 2000, 
        transform: toast.visible ? 'translateX(0)' : 'translateX(120%)', 
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        pointerEvents: toast.visible ? 'auto' : 'none'
      }}>
        <div style={{ 
          background: 'var(--bg-card)', 
          backdropFilter: 'blur(12px)',
          borderLeft: '4px solid var(--color-success)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: '300px'
        }}>
          <CheckCircle color="var(--color-success)" size={24} />
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Thành công</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{toast.message}</div>
          </div>
          <button onClick={() => setToast({ ...toast, visible: false })} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
