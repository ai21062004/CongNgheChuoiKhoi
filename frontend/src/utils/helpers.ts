// ============================================
// Utility Helper Functions
// ============================================

/**
 * Format bytes to human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Format date to localized string
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return formatDate(dateStr);
}

/**
 * Truncate wallet address
 */
export function truncateAddress(address: string, chars = 6): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Truncate CID
 */
export function truncateCID(cid: string, chars = 8): string {
  if (!cid) return '';
  if (cid.length <= chars * 2) return cid;
  return `${cid.slice(0, chars)}...${cid.slice(-chars)}`;
}

/**
 * Get data type display info
 */
export function getDataTypeInfo(type: string): { label: string; color: string } {
  const types: Record<string, { label: string; color: string }> = {
    document: { label: 'Tài liệu', color: 'var(--color-primary)' },
    image: { label: 'Hình ảnh', color: 'var(--color-secondary)' },
    video: { label: 'Video', color: 'var(--color-danger)' },
    audio: { label: 'Âm thanh', color: 'var(--color-warning)' },
    spreadsheet: { label: 'Bảng tính', color: 'var(--color-success)' },
    other: { label: 'Khác', color: 'var(--text-tertiary)' },
  };
  return types[type] || types.other;
}

/**
 * Get status display info
 */
export function getStatusInfo(status: string): { label: string; color: string } {
  const statuses: Record<string, { label: string; color: string }> = {
    active: { label: 'Hoạt động', color: 'var(--color-success)' },
    hidden: { label: 'Đã ẩn', color: 'var(--color-warning)' },
    locked: { label: 'Đã khoá', color: 'var(--color-danger)' },
    pending: { label: 'Chờ duyệt', color: 'var(--color-warning)' },
    granted: { label: 'Đã cấp', color: 'var(--color-primary)' },
    accepted: { label: 'Đã chấp nhận', color: 'var(--color-success)' },
    revoked: { label: 'Đã thu hồi', color: 'var(--color-danger)' },
    rejected: { label: 'Đã từ chối', color: 'var(--color-danger)' },
  };
  return statuses[status] || { label: status, color: 'var(--text-tertiary)' };
}

/**
 * Get audit action display info
 */
export function getAuditActionInfo(action: string): { label: string; icon: string; color: string } {
  const actions: Record<string, { label: string; icon: string; color: string }> = {
    upload: { label: 'Upload dữ liệu', icon: '📤', color: 'var(--color-primary)' },
    access: { label: 'Truy cập dữ liệu', icon: '👁️', color: 'var(--color-accent)' },
    grant_access: { label: 'Cấp quyền', icon: '🔑', color: 'var(--color-success)' },
    revoke_access: { label: 'Thu hồi quyền', icon: '🚫', color: 'var(--color-danger)' },
    update_metadata: { label: 'Cập nhật metadata', icon: '✏️', color: 'var(--color-warning)' },
    delete_data: { label: 'Xoá dữ liệu', icon: '🗑️', color: 'var(--color-danger)' },
    accept_access: { label: 'Chấp nhận quyền', icon: '✅', color: 'var(--color-success)' },
  };
  return actions[action] || { label: action, icon: '📋', color: 'var(--text-tertiary)' };
}

/**
 * Generate a fake transaction hash
 */
export function generateTxHash(): string {
  const hex = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += hex[Math.floor(Math.random() * 16)];
  }
  return hash;
}

/**
 * Delay utility for simulating async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get notification type color
 */
export function getNotificationColor(type: string): string {
  const colors: Record<string, string> = {
    access_request: 'var(--color-primary)',
    access_granted: 'var(--color-success)',
    access_revoked: 'var(--color-danger)',
    integrity_alert: 'var(--color-warning)',
    system: 'var(--color-accent)',
    welcome: 'var(--color-secondary)',
  };
  return colors[type] || 'var(--text-tertiary)';
}
