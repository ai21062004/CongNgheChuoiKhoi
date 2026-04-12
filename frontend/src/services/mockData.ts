// ============================================
// Mock Data for Development
// ============================================
import type {
  User, DataItem, AccessRequest, AccessGrant,
  AuditLogEntry, Notification, DashboardStats, AdminStats
} from '../types';

export const mockCurrentUser: User = {
  id: 'user-001',
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  role: 'user',
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  avatar: '',
  createdAt: '2026-01-15T08:30:00Z',
  isLocked: false,
};

export const mockAdminUser: User = {
  id: 'admin-001',
  name: 'Admin System',
  email: 'admin@system.com',
  role: 'admin',
  walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  avatar: '',
  createdAt: '2025-12-01T00:00:00Z',
  isLocked: false,
};

export const mockUsers: User[] = [
  mockCurrentUser,
  mockAdminUser,
  {
    id: 'user-002', name: 'Trần Thị B', email: 'tranthib@example.com',
    role: 'user', walletAddress: '0xaabb...ccdd', createdAt: '2026-02-10T10:00:00Z', isLocked: false,
  },
  {
    id: 'user-003', name: 'Lê Văn C', email: 'levanc@example.com',
    role: 'user', walletAddress: '0xeeff...1122', createdAt: '2026-03-05T14:20:00Z', isLocked: false,
  },
  {
    id: 'user-004', name: 'Phạm Thị D', email: 'phamthid@example.com',
    role: 'user', walletAddress: '0x3344...5566', createdAt: '2026-03-20T09:15:00Z', isLocked: true,
  },
  {
    id: 'user-005', name: 'Hoàng Văn E', email: 'hoangvane@example.com',
    role: 'user', walletAddress: '0x7788...99aa', createdAt: '2026-04-01T11:30:00Z', isLocked: false,
  },
];

export const mockDataItems: DataItem[] = [
  {
    id: 'data-001', title: 'Báo cáo tài chính Q1 2026', description: 'Báo cáo tài chính quý 1 năm 2026 của công ty ABC',
    dataType: 'document', fileName: 'bao-cao-q1-2026.pdf', fileSize: 2457600,
    cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco', metadataHash: '0xabc123...',
    ownerId: 'user-001', ownerName: 'Nguyễn Văn A', ownerWallet: '0x742d...2bD18',
    status: 'active', integrityValid: true, uploadedAt: '2026-04-01T09:00:00Z', updatedAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 'data-002', title: 'Hợp đồng lao động mẫu', description: 'Mẫu hợp đồng lao động theo quy định mới',
    dataType: 'document', fileName: 'hop-dong-lao-dong.docx', fileSize: 524288,
    cid: 'QmYwAPJzv5CZsnN625s3Xf2nemtYgPpHdWEz79ojWnPbdG', metadataHash: '0xdef456...',
    ownerId: 'user-001', ownerName: 'Nguyễn Văn A', ownerWallet: '0x742d...2bD18',
    status: 'active', integrityValid: true, uploadedAt: '2026-04-05T14:30:00Z', updatedAt: '2026-04-05T14:30:00Z',
  },
  {
    id: 'data-003', title: 'Ảnh thiết kế UI System', description: 'Bản thiết kế giao diện hệ thống mới',
    dataType: 'image', fileName: 'ui-design-v3.png', fileSize: 4194304,
    cid: 'QmZTR5bcpQD7cFgTorqxZDYaew1Wqgfbd2ud9QqGPAkK2V', metadataHash: '0xghi789...',
    ownerId: 'user-002', ownerName: 'Trần Thị B', ownerWallet: '0xaabb...ccdd',
    status: 'active', integrityValid: true, uploadedAt: '2026-04-08T11:15:00Z', updatedAt: '2026-04-08T11:15:00Z',
  },
  {
    id: 'data-004', title: 'Video hướng dẫn sử dụng', description: 'Video hướng dẫn sử dụng hệ thống blockchain',
    dataType: 'video', fileName: 'huong-dan.mp4', fileSize: 104857600,
    cid: 'QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB', metadataHash: '0xjkl012...',
    ownerId: 'user-003', ownerName: 'Lê Văn C', ownerWallet: '0xeeff...1122',
    status: 'active', integrityValid: true, uploadedAt: '2026-04-10T16:45:00Z', updatedAt: '2026-04-10T16:45:00Z',
  },
  {
    id: 'data-005', title: 'Dữ liệu khách hàng 2025', description: 'Bảng dữ liệu khách hàng năm 2025',
    dataType: 'spreadsheet', fileName: 'customers-2025.xlsx', fileSize: 1048576,
    cid: 'QmW2WQi7j6c7UgJTarActp7tDNikE4B2q3iPVswKCHGmhR', metadataHash: '0xmno345...',
    ownerId: 'user-001', ownerName: 'Nguyễn Văn A', ownerWallet: '0x742d...2bD18',
    status: 'active', integrityValid: false, uploadedAt: '2026-04-11T08:00:00Z', updatedAt: '2026-04-12T10:00:00Z',
  },
  {
    id: 'data-006', title: 'Biên bản họp tháng 3', description: 'Biên bản cuộc họp ban giám đốc tháng 3/2026',
    dataType: 'document', fileName: 'bien-ban-hop-t3.pdf', fileSize: 786432,
    cid: 'QmNRCQdLCvGkBhDBiENWYk2g4QXAQbN2tGcKnR1N2gePvZ', metadataHash: '0xpqr678...',
    ownerId: 'user-002', ownerName: 'Trần Thị B', ownerWallet: '0xaabb...ccdd',
    status: 'hidden', integrityValid: true, uploadedAt: '2026-03-28T10:30:00Z', updatedAt: '2026-04-02T15:00:00Z',
  },
];

export const mockAccessRequests: AccessRequest[] = [
  {
    id: 'req-001', dataId: 'data-001', dataTitle: 'Báo cáo tài chính Q1 2026',
    requesterId: 'user-002', requesterName: 'Trần Thị B', requesterWallet: '0xaabb...ccdd',
    ownerId: 'user-001', ownerName: 'Nguyễn Văn A',
    permissions: ['read'], status: 'pending',
    message: 'Tôi cần xem báo cáo tài chính để hoàn thành audit.',
    requestedAt: '2026-04-12T08:00:00Z',
  },
  {
    id: 'req-002', dataId: 'data-002', dataTitle: 'Hợp đồng lao động mẫu',
    requesterId: 'user-003', requesterName: 'Lê Văn C', requesterWallet: '0xeeff...1122',
    ownerId: 'user-001', ownerName: 'Nguyễn Văn A',
    permissions: ['read', 'download'], status: 'pending',
    message: 'Cần tải hợp đồng mẫu cho phòng nhân sự.',
    requestedAt: '2026-04-12T09:30:00Z',
  },
  {
    id: 'req-003', dataId: 'data-005', dataTitle: 'Dữ liệu khách hàng 2025',
    requesterId: 'user-005', requesterName: 'Hoàng Văn E', requesterWallet: '0x7788...99aa',
    ownerId: 'user-001', ownerName: 'Nguyễn Văn A',
    permissions: ['read'], status: 'granted',
    requestedAt: '2026-04-11T14:00:00Z', respondedAt: '2026-04-11T15:00:00Z',
    txHash: '0xabcd1234567890...',
  },
];

export const mockAccessGrants: AccessGrant[] = [
  {
    id: 'grant-001', dataId: 'data-003', dataTitle: 'Ảnh thiết kế UI System',
    grantedTo: 'user-001', grantedToName: 'Nguyễn Văn A',
    grantedBy: 'user-002', permissions: ['read', 'download'],
    status: 'active', grantedAt: '2026-04-09T10:00:00Z', acceptedAt: '2026-04-09T10:30:00Z',
    txHash: '0x1111aaaa...',
  },
  {
    id: 'grant-002', dataId: 'data-004', dataTitle: 'Video hướng dẫn sử dụng',
    grantedTo: 'user-001', grantedToName: 'Nguyễn Văn A',
    grantedBy: 'user-003', permissions: ['read'],
    status: 'active', grantedAt: '2026-04-10T17:00:00Z', acceptedAt: '2026-04-10T17:05:00Z',
    txHash: '0x2222bbbb...',
  },
  {
    id: 'grant-003', dataId: 'data-001', dataTitle: 'Báo cáo tài chính Q1 2026',
    grantedTo: 'user-005', grantedToName: 'Hoàng Văn E',
    grantedBy: 'user-001', permissions: ['read'],
    status: 'revoked', grantedAt: '2026-04-05T10:00:00Z', revokedAt: '2026-04-08T09:00:00Z',
    txHash: '0x3333cccc...',
  },
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-001', action: 'upload', userId: 'user-001', userName: 'Nguyễn Văn A',
    dataId: 'data-005', dataTitle: 'Dữ liệu khách hàng 2025',
    details: 'Uploaded file: customers-2025.xlsx (1MB)',
    txHash: '0xf1a2b3c4d5e6f7...', blockNumber: 18245001, timestamp: '2026-04-11T08:00:00Z',
  },
  {
    id: 'log-002', action: 'grant_access', userId: 'user-001', userName: 'Nguyễn Văn A',
    dataId: 'data-005', dataTitle: 'Dữ liệu khách hàng 2025',
    targetUserId: 'user-005', targetUserName: 'Hoàng Văn E',
    details: 'Granted READ access to Hoàng Văn E',
    txHash: '0xa1b2c3d4e5f6a7...', blockNumber: 18245050, timestamp: '2026-04-11T15:00:00Z',
  },
  {
    id: 'log-003', action: 'access', userId: 'user-001', userName: 'Nguyễn Văn A',
    dataId: 'data-003', dataTitle: 'Ảnh thiết kế UI System',
    details: 'Accessed file: ui-design-v3.png',
    txHash: '0xb2c3d4e5f6a7b8...', blockNumber: 18245100, timestamp: '2026-04-12T09:00:00Z',
  },
  {
    id: 'log-004', action: 'revoke_access', userId: 'user-001', userName: 'Nguyễn Văn A',
    dataId: 'data-001', dataTitle: 'Báo cáo tài chính Q1 2026',
    targetUserId: 'user-005', targetUserName: 'Hoàng Văn E',
    details: 'Revoked READ access from Hoàng Văn E',
    txHash: '0xc3d4e5f6a7b8c9...', blockNumber: 18244500, timestamp: '2026-04-08T09:00:00Z',
  },
  {
    id: 'log-005', action: 'upload', userId: 'user-002', userName: 'Trần Thị B',
    dataId: 'data-003', dataTitle: 'Ảnh thiết kế UI System',
    details: 'Uploaded file: ui-design-v3.png (4MB)',
    txHash: '0xd4e5f6a7b8c9d0...', blockNumber: 18244200, timestamp: '2026-04-08T11:15:00Z',
  },
  {
    id: 'log-006', action: 'accept_access', userId: 'user-001', userName: 'Nguyễn Văn A',
    dataId: 'data-003', dataTitle: 'Ảnh thiết kế UI System',
    details: 'Accepted access grant from Trần Thị B',
    txHash: '0xe5f6a7b8c9d0e1...', blockNumber: 18244250, timestamp: '2026-04-09T10:30:00Z',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001', type: 'access_request', title: 'Yêu cầu truy cập mới',
    message: 'Trần Thị B yêu cầu truy cập "Báo cáo tài chính Q1 2026"',
    read: false, link: '/access', createdAt: '2026-04-12T08:00:00Z',
  },
  {
    id: 'notif-002', type: 'access_request', title: 'Yêu cầu truy cập mới',
    message: 'Lê Văn C yêu cầu tải xuống "Hợp đồng lao động mẫu"',
    read: false, link: '/access', createdAt: '2026-04-12T09:30:00Z',
  },
  {
    id: 'notif-003', type: 'integrity_alert', title: '⚠️ Cảnh báo toàn vẹn dữ liệu',
    message: 'File "Dữ liệu khách hàng 2025" có hash không khớp với blockchain!',
    read: false, link: '/data/data-005', createdAt: '2026-04-12T10:00:00Z',
  },
  {
    id: 'notif-004', type: 'access_granted', title: 'Đã được cấp quyền',
    message: 'Trần Thị B đã cấp quyền truy cập "Ảnh thiết kế UI System"',
    read: true, link: '/access', createdAt: '2026-04-09T10:00:00Z',
  },
  {
    id: 'notif-005', type: 'welcome', title: 'Chào mừng!',
    message: 'Bạn đã nhận 100 tokens để bắt đầu sử dụng hệ thống.',
    read: true, createdAt: '2026-01-15T08:30:00Z',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalFiles: 4,
  sharedFiles: 2,
  pendingRequests: 2,
  storageUsed: 108_961_792,
  totalAccesses: 15,
  integrityAlerts: 1,
};

export const mockAdminStats: AdminStats = {
  totalUsers: 5,
  totalData: 6,
  totalTransactions: 45,
  activeUsers: 4,
  lockedUsers: 1,
  flaggedData: 1,
};
