// ============================================
// TypeScript Interfaces for Blockchain Data Management System
// ============================================

// --- User ---
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  walletAddress?: string;
  avatar?: string;
  createdAt: string;
  isLocked: boolean;
}

// --- Data / File ---
export type DataType = 'document' | 'image' | 'video' | 'audio' | 'spreadsheet' | 'other';
export type DataStatus = 'active' | 'hidden' | 'locked';

export interface DataItem {
  id: string;
  title: string;
  description: string;
  dataType: DataType;
  fileName: string;
  fileSize: number;
  cid: string; // IPFS Content Identifier
  metadataHash: string;
  ownerId: string;
  ownerName: string;
  ownerWallet: string;
  status: DataStatus;
  integrityValid: boolean;
  uploadedAt: string;
  updatedAt: string;
}

// --- Access Control ---
export type Permission = 'read' | 'download';
export type AccessStatus = 'pending' | 'granted' | 'accepted' | 'revoked' | 'rejected';

export interface AccessRequest {
  id: string;
  dataId: string;
  dataTitle: string;
  requesterId: string;
  requesterName: string;
  requesterWallet: string;
  ownerId: string;
  ownerName: string;
  permissions: Permission[];
  status: AccessStatus;
  message?: string;
  requestedAt: string;
  respondedAt?: string;
  txHash?: string;
}

export interface AccessGrant {
  id: string;
  dataId: string;
  dataTitle: string;
  grantedTo: string;
  grantedToName: string;
  grantedBy: string;
  permissions: Permission[];
  status: 'active' | 'revoked';
  grantedAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  txHash?: string;
}

// --- Audit Log ---
export type AuditAction = 'upload' | 'access' | 'grant_access' | 'revoke_access' | 'update_metadata' | 'delete_data' | 'accept_access';

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  userId: string;
  userName: string;
  dataId?: string;
  dataTitle?: string;
  targetUserId?: string;
  targetUserName?: string;
  details: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
}

// --- Notification ---
export type NotificationType = 'access_request' | 'access_granted' | 'access_revoked' | 'integrity_alert' | 'system' | 'welcome';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

// --- Dashboard Stats ---
export interface DashboardStats {
  totalFiles: number;
  sharedFiles: number;
  pendingRequests: number;
  storageUsed: number; // in bytes
  totalAccesses: number;
  integrityAlerts: number;
}

// --- Admin Stats ---
export interface AdminStats {
  totalUsers: number;
  totalData: number;
  totalTransactions: number;
  activeUsers: number;
  lockedUsers: number;
  flaggedData: number;
}
