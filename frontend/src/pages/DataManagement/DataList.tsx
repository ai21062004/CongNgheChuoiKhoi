// ============================================
// Data Management - List Page
// ============================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, FileText, Download, Shield } from 'lucide-react';
import { mockDataItems } from '../../services/mockData';
import { formatFileSize, formatRelativeTime, getDataTypeInfo } from '../../utils/helpers';
import '../shared.css';

export default function DataList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredData = mockDataItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.dataType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Quản lý dữ liệu</h2>
          <p>Tất cả file bạn đã upload lên hệ thống</p>
        </div>
        <div className="page-header-actions">
          <Link to="/data/upload" className="btn btn-primary">
            <Plus size={18} /> Upload file mới
          </Link>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="filter-input"
            placeholder="Tìm kiếm theo tên..."
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
        <button className="btn btn-secondary">
          <Filter size={18} /> Bộ lọc nâng cao
        </button>
      </div>

      {filteredData.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FileText size={32} />
          </div>
          <h3>Không tìm thấy dữ liệu</h3>
          <p>Trống hoặc không có file nào khớp với tìm kiếm của bạn.</p>
          <Link to="/data/upload" className="btn btn-primary">Upload ngay</Link>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên File / Dữ liệu</th>
              <th>Loại</th>
              <th>Kích thước</th>
              <th>Toàn vẹn (Hash)</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => {
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
                  <td>
                    <span className={`integrity-dot ${item.integrityValid ? 'valid' : 'invalid'}`} title="So sánh với blockchain record">
                      {item.integrityValid ? 'Hợp lệ' : 'Cảnh báo'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{formatRelativeTime(item.uploadedAt)}</td>
                  <td>
                    <div className="data-table-actions">
                      <Link to={`/data/${item.id}`} className="btn btn-secondary btn-sm" title="Chi tiết">
                        <FileText size={16} />
                      </Link>
                      <button className="btn btn-secondary btn-sm" title="Tải xuống">
                        <Download size={16} />
                      </button>
                      <button className="btn btn-secondary btn-sm" title="Quản lý quyền">
                        <Shield size={16} />
                      </button>
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
