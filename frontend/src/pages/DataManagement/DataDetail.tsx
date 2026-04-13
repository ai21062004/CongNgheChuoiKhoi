// ============================================
// Data Management - Detail Page
// ============================================
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, Shield, Clock, ExternalLink, Hash, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockDataItems } from '../../services/mockData';
import { formatFileSize, formatDate, getDataTypeInfo, truncateCID } from '../../utils/helpers';
import '../shared.css';

export default function DataDetail() {
  const { id } = useParams<{ id: string }>();

  const data = mockDataItems.find(d => d.id === id) || mockDataItems[0];
  const typeInfo = getDataTypeInfo(data.dataType);

  const renderFilePreview = (data: any) => {
    switch (data.dataType) {
      case 'image':
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <img 
              src={`https://picsum.photos/seed/${data.id}/1200/800`} 
              alt={data.title} 
              style={{ maxWidth: '100%', maxHeight: '600px', borderRadius: '8px', objectFit: 'contain', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
            />
          </div>
        );
      case 'video':
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
             <video width="100%" controls poster={`https://picsum.photos/seed/${data.id}/1200/800`}>
                 <source src="#" type="video/mp4" />
                 Trình duyệt không hỗ trợ thẻ video.
             </video>
          </div>
        );
      case 'document':
        return (
          <div style={{ width: '100%', height: '600px', padding: '32px', background: '#f3f4f6', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
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
           <div style={{ width: '100%', height: '600px', overflow: 'auto', display: 'flex', flexDirection: 'column', background: 'white' }}>
             <div style={{ display: 'flex', background: '#f9fafb', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #e5e7eb' }}>
               <div style={{ flex: '0 0 50px', background: '#f3f4f6', borderRight: '1px solid #d1d5db' }}></div>
               {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(col => (
                 <div key={col} style={{ flex: '0 0 120px', padding: '8px', borderRight: '1px solid #e5e7eb', textAlign: 'center', fontWeight: 600, fontSize: '12px', color: '#4b5563' }}>{col}</div>
               ))}
             </div>
             {[1,2,3,4,5,6,7,8,9,10,11,12].map(row => (
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
          <div style={{ width: '100%', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', background: 'var(--bg-glass)' }}>
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
          <div style={{ width: '100%', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', color: 'var(--text-tertiary)', background: 'var(--bg-card)' }}>
             <FileText size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
             <p>Định dạng dữ liệu không có chế độ xem trước khả dụng.</p>
          </div>
        );
    }
  };

  return (
    <div className="detail-page animate-fade-in">
      <div className="detail-header">
        <div>
          <div className="detail-title">{data.title}</div>
          <div className="detail-meta">
            <span className="badge" style={{ background: typeInfo.color + '22', color: typeInfo.color }}>
              {typeInfo.label}
            </span>
            <div className="detail-meta-item">
              <Clock size={16} /> Thời gian: {formatDate(data.uploadedAt)}
            </div>
            <div className="detail-meta-item">
              <FileText size={16} /> File: {data.fileName} ({formatFileSize(data.fileSize)})
            </div>
          </div>
        </div>
      </div>

      <div className="detail-card" style={{ marginTop: 'var(--space-6)', overflow: 'hidden' }}>
        <div className="detail-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Nội dung tài liệu</span>
        </div>
        <div className="detail-card-body" style={{ padding: 0 }}>
          {renderFilePreview(data)}
        </div>
      </div>
    </div>
  );
}
