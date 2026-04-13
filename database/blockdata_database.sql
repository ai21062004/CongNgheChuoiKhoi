-- ============================================================
-- CSDL HỆ THỐNG QUẢN LÝ DỮ LIỆU BLOCKCHAIN - BLOCKDATA
-- Database: MySQL 8.0+
-- Tạo bởi: Phân tích từ Frontend React Application
-- Ngày tạo: 2026-04-13
-- ============================================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS blockdata_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE blockdata_db;

-- ============================================================
-- 1. BẢNG USERS - Người dùng
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL COMMENT 'Họ và tên',
  email VARCHAR(255) NOT NULL COMMENT 'Email đăng nhập (unique)',
  password_hash VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã mã hoá bcrypt',
  wallet_address VARCHAR(42) NOT NULL COMMENT 'Địa chỉ ví MetaMask (0x...)',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo tài khoản',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',

  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email),
  UNIQUE KEY uk_users_wallet (wallet_address),
  INDEX idx_users_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bảng người dùng hệ thống - hỗ trợ đăng nhập email và MetaMask';

-- ============================================================
-- 2. BẢNG DATA_ITEMS - Dữ liệu / Tài liệu
-- ============================================================
CREATE TABLE IF NOT EXISTS data_items (
  id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL COMMENT 'Tiêu đề dữ liệu',
  description TEXT DEFAULT NULL COMMENT 'Mô tả chi tiết',
  data_type ENUM('document', 'image', 'video', 'audio', 'spreadsheet', 'other') NOT NULL COMMENT 'Loại dữ liệu',
  file_name VARCHAR(500) NOT NULL COMMENT 'Tên file gốc',
  file_size BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Kích thước file (bytes)',
  cid VARCHAR(100) NOT NULL COMMENT 'IPFS Content Identifier',
  metadata_hash VARCHAR(100) NOT NULL COMMENT 'Hash metadata trên blockchain',
  owner_id VARCHAR(36) NOT NULL COMMENT 'Chủ sở hữu file',
  status ENUM('active', 'hidden') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái hiển thị',
  integrity_valid BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Kiểm tra toàn vẹn hash với blockchain',
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tải lên',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật',

  PRIMARY KEY (id),
  UNIQUE KEY uk_data_cid (cid),
  INDEX idx_data_owner (owner_id),
  INDEX idx_data_type (data_type),
  INDEX idx_data_status (status),
  INDEX idx_data_integrity (integrity_valid),
  INDEX idx_data_uploaded (uploaded_at),
  FULLTEXT INDEX ft_data_search (title, description),

  CONSTRAINT fk_data_owner
    FOREIGN KEY (owner_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Metadata tài liệu - file thực tế lưu trên IPFS';

-- ============================================================
-- 3. BẢNG ACCESS_REQUESTS - Yêu cầu truy cập
-- ============================================================
CREATE TABLE IF NOT EXISTS access_requests (
  id VARCHAR(36) NOT NULL,
  data_id VARCHAR(36) NOT NULL COMMENT 'Dữ liệu yêu cầu truy cập',
  requester_id VARCHAR(36) NOT NULL COMMENT 'Người gửi yêu cầu',
  owner_id VARCHAR(36) NOT NULL COMMENT 'Chủ sở hữu dữ liệu',
  permissions JSON NOT NULL COMMENT 'Danh sách quyền yêu cầu: ["read","download"]',
  status ENUM('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái xử lý',
  message TEXT DEFAULT NULL COMMENT 'Tin nhắn/lý do yêu cầu',
  requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm gửi yêu cầu',
  responded_at DATETIME DEFAULT NULL COMMENT 'Thời điểm phản hồi',
  tx_hash VARCHAR(100) DEFAULT NULL COMMENT 'Hash giao dịch blockchain khi xử lý',

  PRIMARY KEY (id),
  INDEX idx_req_data (data_id),
  INDEX idx_req_requester (requester_id),
  INDEX idx_req_owner (owner_id),
  INDEX idx_req_status (status),
  INDEX idx_req_requested (requested_at),

  CONSTRAINT fk_req_data
    FOREIGN KEY (data_id) REFERENCES data_items(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_req_requester
    FOREIGN KEY (requester_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_req_owner
    FOREIGN KEY (owner_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Yêu cầu truy cập dữ liệu - flow: pending → granted/rejected → accepted/revoked';

-- ============================================================
-- 4. BẢNG ACCESS_GRANTS - Quyền truy cập đã cấp
-- ============================================================
CREATE TABLE IF NOT EXISTS access_grants (
  id VARCHAR(36) NOT NULL,
  data_id VARCHAR(36) NOT NULL COMMENT 'Dữ liệu được cấp quyền',
  granted_to VARCHAR(36) NOT NULL COMMENT 'Người được cấp quyền',
  granted_by VARCHAR(36) NOT NULL COMMENT 'Người cấp quyền (chủ sở hữu)',
  permissions JSON NOT NULL COMMENT 'Danh sách quyền: ["read","download"]',
  status ENUM('active', 'revoked') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái quyền',
  granted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm cấp',
  accepted_at DATETIME DEFAULT NULL COMMENT 'Thời điểm chấp nhận',
  revoked_at DATETIME DEFAULT NULL COMMENT 'Thời điểm thu hồi',
  tx_hash VARCHAR(100) DEFAULT NULL COMMENT 'Hash giao dịch blockchain',

  PRIMARY KEY (id),
  INDEX idx_grant_data (data_id),
  INDEX idx_grant_to (granted_to),
  INDEX idx_grant_by (granted_by),
  INDEX idx_grant_status (status),
  INDEX idx_grant_granted_at (granted_at),
  -- Một user chỉ có 1 bản grant active cho mỗi data
  UNIQUE KEY uk_grant_active (data_id, granted_to, status),

  CONSTRAINT fk_grant_data
    FOREIGN KEY (data_id) REFERENCES data_items(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_grant_to
    FOREIGN KEY (granted_to) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_grant_by
    FOREIGN KEY (granted_by) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Quyền truy cập đã được cấp - chủ sở hữu có thể thêm quyền hoặc thu hồi';

-- ============================================================
-- 5. BẢNG AUDIT_LOGS - Nhật ký kiểm soát Blockchain
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(36) NOT NULL,
  action ENUM('upload', 'access', 'grant_access', 'revoke_access', 'update_metadata', 'delete_data', 'accept_access') NOT NULL COMMENT 'Loại hành động',
  user_id VARCHAR(36) NOT NULL COMMENT 'Người thực hiện hành động',
  data_id VARCHAR(36) DEFAULT NULL COMMENT 'Dữ liệu liên quan (nếu có)',
  target_user_id VARCHAR(36) DEFAULT NULL COMMENT 'User bị tác động (nếu có)',
  details TEXT NOT NULL COMMENT 'Mô tả chi tiết hành động',
  tx_hash VARCHAR(100) NOT NULL COMMENT 'Hash giao dịch blockchain',
  block_number BIGINT UNSIGNED NOT NULL COMMENT 'Số block trên blockchain',
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm ghi log',

  PRIMARY KEY (id),
  INDEX idx_log_action (action),
  INDEX idx_log_user (user_id),
  INDEX idx_log_data (data_id),
  INDEX idx_log_target (target_user_id),
  INDEX idx_log_timestamp (timestamp),
  INDEX idx_log_block (block_number),

  CONSTRAINT fk_log_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_log_data
    FOREIGN KEY (data_id) REFERENCES data_items(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_log_target
    FOREIGN KEY (target_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Nhật ký kiểm soát blockchain - mọi hành động đều ghi kèm tx_hash';

-- ============================================================
-- 6. BẢNG NOTIFICATIONS - Thông báo
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL COMMENT 'Người nhận thông báo',
  type ENUM('access_request', 'access_granted', 'access_revoked', 'integrity_alert', 'system', 'welcome') NOT NULL COMMENT 'Loại thông báo',
  title VARCHAR(255) NOT NULL COMMENT 'Tiêu đề thông báo',
  message TEXT NOT NULL COMMENT 'Nội dung thông báo',
  is_read BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Đã đọc chưa',
  link VARCHAR(500) DEFAULT NULL COMMENT 'Đường dẫn điều hướng (vd: /access, /data/data-005)',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo',

  PRIMARY KEY (id),
  INDEX idx_notif_user (user_id),
  INDEX idx_notif_type (type),
  INDEX idx_notif_read (is_read),
  INDEX idx_notif_created (created_at),
  -- Composite index cho truy vấn thông báo chưa đọc của user
  INDEX idx_notif_user_unread (user_id, is_read, created_at),

  CONSTRAINT fk_notif_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Hệ thống thông báo - hiển thị badge đếm chưa đọc trên sidebar';

-- ============================================================
-- 7. BẢNG USER_SESSIONS - Phiên đăng nhập
-- ============================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL COMMENT 'Người dùng',
  token VARCHAR(500) NOT NULL COMMENT 'JWT hoặc Session Token',
  login_method ENUM('email', 'metamask') NOT NULL COMMENT 'Phương thức đăng nhập',
  ip_address VARCHAR(45) DEFAULT NULL COMMENT 'Địa chỉ IP (hỗ trợ IPv6)',
  user_agent TEXT DEFAULT NULL COMMENT 'Thông tin trình duyệt',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo phiên',
  expires_at DATETIME NOT NULL COMMENT 'Thời điểm hết hạn',
  is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Phiên còn hiệu lực',
  PRIMARY KEY (id),
  UNIQUE KEY uk_session_token (token),
  INDEX idx_session_user (user_id),
  INDEX idx_session_expires (expires_at),

  CONSTRAINT fk_session_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Quản lý phiên đăng nhập - hỗ trợ cả email và MetaMask';




