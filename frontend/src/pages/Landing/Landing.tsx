// ============================================
// Landing Page - Guest Homepage
// ============================================
import { Link } from 'react-router-dom';
import { Database, Link2, Shield, Eye, ScrollText, Lock } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <Link to="/" className="landing-nav-logo">
          <div className="landing-nav-logo-icon">
            <Database size={20} />
          </div>
          BlockData
        </Link>
        <div className="landing-nav-actions">
          <Link to="/login" className="landing-btn landing-btn-ghost">Đăng nhập</Link>
          <Link to="/register" className="landing-btn landing-btn-primary">Đăng ký</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <Lock size={14} />
            Bảo mật bằng Blockchain
          </div>
          <h1>
            Quản lý dữ liệu{' '}
            <span className="gradient-text">phi tập trung</span>{' '}
            an toàn & minh bạch
          </h1>
          <p>
            Hệ thống lưu trữ và chia sẻ dữ liệu sử dụng công nghệ Blockchain và IPFS.
            Kiểm soát quyền truy cập hoàn toàn, đảm bảo tính toàn vẹn dữ liệu.
          </p>
          <div className="landing-hero-actions">
            <Link to="/register" className="landing-btn landing-btn-primary landing-btn-lg">
              Bắt đầu ngay
            </Link>
            <Link to="/login" className="landing-btn landing-btn-ghost landing-btn-lg">
              Đã có tài khoản
            </Link>
          </div>

          {/* Blockchain graphic */}
          <div className="landing-hero-graphic">
            <div className="landing-block"><Shield size={32} /></div>
            <div className="landing-chain"><Link2 size={20} /></div>
            <div className="landing-block"><Database size={32} /></div>
            <div className="landing-chain"><Link2 size={20} /></div>
            <div className="landing-block"><Eye size={32} /></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <h2 className="landing-section-title">Tính năng nổi bật</h2>
        <p className="landing-section-subtitle">
          Giải pháp toàn diện cho quản lý dữ liệu an toàn trên nền tảng blockchain
        </p>
        <div className="landing-features-grid stagger-children">
          <div className="landing-feature-card">
            <div className="landing-feature-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Database size={24} />
            </div>
            <h3>Lưu trữ IPFS</h3>
            <p>Dữ liệu được mã hoá và lưu trữ phi tập trung trên IPFS, đảm bảo tính khả dụng và không thể bị chỉnh sửa.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon" style={{ background: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}>
              <Shield size={24} />
            </div>
            <h3>Quyền truy cập Blockchain</h3>
            <p>Mọi quyền truy cập được quản lý bởi Smart Contract, minh bạch và không thể giả mạo.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              <Eye size={24} />
            </div>
            <h3>Kiểm tra toàn vẹn</h3>
            <p>Tự động so sánh hash dữ liệu với blockchain để phát hiện mọi thay đổi trái phép.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
              <ScrollText size={24} />
            </div>
            <h3>Audit Log bất biến</h3>
            <p>Mọi hành động đều được ghi nhận trên blockchain. Không thể sửa, không thể xoá.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-steps">
        <div className="landing-steps-inner">
          <h2 className="landing-section-title">Cách hoạt động</h2>
          <p className="landing-section-subtitle">3 bước đơn giản để bắt đầu</p>
          <div className="landing-steps-list stagger-children">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <div className="landing-step-content">
                <h3>Đăng ký & Kết nối ví</h3>
                <p>Tạo tài khoản và kết nối ví MetaMask. Hệ thống tự động cấp token cho bạn để trả gas fee.</p>
              </div>
            </div>
            <div className="landing-step">
              <div className="landing-step-number">2</div>
              <div className="landing-step-content">
                <h3>Upload & Mã hoá dữ liệu</h3>
                <p>Tải file lên, hệ thống tự động mã hoá, lưu lên IPFS và ghi CID + metadata lên Blockchain.</p>
              </div>
            </div>
            <div className="landing-step">
              <div className="landing-step-number">3</div>
              <div className="landing-step-content">
                <h3>Chia sẻ & Kiểm soát</h3>
                <p>Cấp quyền truy cập cho người khác qua Smart Contract. Thu hồi quyền bất kỳ lúc nào.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="landing-cta-card">
          <h2>Sẵn sàng bắt đầu?</h2>
          <p>Tham gia hệ thống quản lý dữ liệu phi tập trung ngay hôm nay</p>
          <Link to="/register" className="landing-btn landing-btn-primary landing-btn-lg">
            Tạo tài khoản miễn phí
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 BlockData. Hệ thống quản lý dữ liệu phi tập trung.</p>
      </footer>
    </div>
  );
}
