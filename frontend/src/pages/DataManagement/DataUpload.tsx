// ============================================
// Data Management - Upload Page
// ============================================
import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, X, ShieldCheck } from 'lucide-react';
import { formatFileSize, delay } from '../../utils/helpers';
import '../shared.css';

export default function DataUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dataType, setDataType] = useState('document');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
      // Use filename as initial title (without extension)
      setTitle(selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name);
    }
  };

  const cancelSelection = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);
    
    // Simulating steps: Encryption -> IPFS -> Smart Contract
    setUploadProgress(10);
    await delay(500); // Mã hoá
    setUploadProgress(40);
    await delay(800); // Upload IPFS
    setUploadProgress(70);
    await delay(1000); // Ghi Blockchain
    setUploadProgress(100);
    await delay(300);

    // Done
    navigate('/data');
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Upload Dữ liệu</h2>
          <p>Tải file lên hệ thống, tự động mã hoá và lưu CID lên Blockchain</p>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <div className="detail-card-header">Thông tin Metadata</div>
          <div className="detail-card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="title">Tiêu đề *</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề dữ liệu"
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="form-field">
                <label htmlFor="type">Loại dữ liệu</label>
                <select
                  id="type"
                  value={dataType}
                  onChange={e => setDataType(e.target.value)}
                  disabled={isUploading}
                >
                  <option value="document">Tài liệu (PDF, Word...)</option>
                  <option value="image">Hình ảnh (PNG, JPG...)</option>
                  <option value="video">Video (MP4...)</option>
                  <option value="spreadsheet">Bảng tính (Excel...)</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="desc">Mô tả (tuỳ chọn)</label>
                <textarea
                  id="desc"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Mô tả nội dung file..."
                  disabled={isUploading}
                />
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/data')}
                  disabled={isUploading}
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!file || !title || isUploading}
                >
                  {isUploading ? 'Đang Upload...' : 'Bắt đầu Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="detail-card" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="detail-card-header">File Dữ liệu</div>
            <div className="detail-card-body">
              {!file ? (
                <div
                  className="upload-area"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="upload-area-icon">
                    <UploadCloud size={24} />
                  </div>
                  <h3>Kéo thả file vào đây</h3>
                  <p>hoặc click để chọn file</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="upload-file-info">
                  <File size={24} color="var(--color-primary)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="truncate" style={{ fontWeight: 500, fontSize: 'var(--font-sm)' }}>
                      {file.name}
                    </div>
                    <div className="upload-file-size">{formatFileSize(file.size)}</div>
                  </div>
                  {!isUploading && (
                    <button className="btn-icon" onClick={cancelSelection} style={{ color: 'var(--text-muted)' }}>
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">Quy trình hệ thống</div>
            <div className="detail-card-body">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <ShieldCheck size={18} color="var(--color-success)" style={{ flexShrink: 0 }} />
                  <span>File được mã hoá AES-256 ngay trên trình duyệt (client-side)</span>
                </li>
                <li style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <ShieldCheck size={18} color="var(--color-success)" style={{ flexShrink: 0 }} />
                  <span>Bản mã lưu trên IPFS phi tập trung</span>
                </li>
                <li style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <ShieldCheck size={18} color="var(--color-success)" style={{ flexShrink: 0 }} />
                  <span>Metadata, CID và Hash lưu trên Smart Contract</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
