// ============================================
// Search Page
// ============================================
import { useState } from 'react';
import { Search as SearchIcon, FileText, Database, Filter } from 'lucide-react';
import { mockDataItems } from '../../services/mockData';
import { formatFileSize, getDataTypeInfo } from '../../utils/helpers';
import '../shared.css';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  
  const results = query ? mockDataItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.ownerName.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Tìm kiếm toàn hệ thống</h2>
          <p>Tìm kiếm dữ liệu công khai trên mạng lưới Blockchain</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto var(--space-8)' }}>
        <div style={{ position: 'relative', display: 'flex', gap: 'var(--space-2)' }}>
          <div className="filter-input-wrapper" style={{ flex: 1 }}>
            <SearchIcon size={20} />
            <input
              type="text"
              className="filter-input"
              style={{ padding: 'var(--space-4) var(--space-4) var(--space-4) var(--space-12)', fontSize: 'var(--font-lg)' }}
              placeholder="Nhập tên file, mô tả hoặc tên tổ chức..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <button className="btn btn-primary" style={{ padding: '0 var(--space-6)' }}>
            Tìm kiếm
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Tìm kiếm phổ biến:</span>
          <button className="badge" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => setQuery('Báo cáo')}>Báo cáo</button>
          <button className="badge" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => setQuery('Thiết kế')}>Thiết kế</button>
          <button className="badge" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => setQuery('Hợp đồng')}>Hợp đồng</button>
        </div>
      </div>

      {query && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-lg)' }}>Kết quả tìm kiếm ({results.length})</h3>
            <button className="btn btn-secondary btn-sm"><Filter size={16} /> Lọc kết quả</button>
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
               <div className="empty-state-icon"><Database size={32} /></div>
               <h3>Không tìm thấy dữ liệu nào</h3>
               <p>Hãy thử với từ khoá khác hoặc sử dụng bộ lọc nâng cao.</p>
            </div>
          ) : (
            <div className="card-grid">
              {results.map(item => {
                const typeInfo = getDataTypeInfo(item.dataType);
                return (
                  <div key={item.id} className="detail-card hover-glow" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="detail-card-body" style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                        <span className="badge" style={{ background: typeInfo.color + '22', color: typeInfo.color }}>
                          {typeInfo.label}
                        </span>
                        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{formatFileSize(item.fileSize)}</span>
                      </div>
                      <h3 style={{ fontSize: 'var(--font-lg)', margin: 'var(--space-2) 0' }}>{item.title}</h3>
                      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10 }}>
                          {item.ownerName.charAt(0)}
                        </div>
                        <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>{item.ownerName}</span>
                      </div>
                    </div>
                    <div style={{ padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Gửi Request</button>
                      <button className="btn btn-secondary" title="Xem chi tiết (Public)"><FileText size={18} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
