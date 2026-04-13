// ============================================
// User Model - MySQL CRUD Operations
// ============================================
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  wallet_address: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  walletAddress: string;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  createdAt: string;
}

// Chuyển đổi row DB → object public
function toPublic(row: UserRow): UserPublic {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    walletAddress: row.wallet_address,
    createdAt: row.created_at.toISOString(),
  };
}

export async function findByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows.length > 0 ? (rows[0] as UserRow) : null;
}

export async function findByWallet(walletAddress: string): Promise<UserRow | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE wallet_address = ?',
    [walletAddress.toLowerCase()]
  );
  return rows.length > 0 ? (rows[0] as UserRow) : null;
}

export async function findById(id: string): Promise<UserRow | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows.length > 0 ? (rows[0] as UserRow) : null;
}

export async function createUser(data: CreateUserData): Promise<UserPublic> {
  const id = uuidv4();
  const walletLower = data.walletAddress.toLowerCase();

  await pool.execute<ResultSetHeader>(
    'INSERT INTO users (id, name, email, password_hash, wallet_address) VALUES (?, ?, ?, ?, ?)',
    [id, data.name, data.email, data.passwordHash, walletLower]
  );

  const user = await findById(id);
  if (!user) throw new Error('Failed to create user');
  return toPublic(user);
}

export async function createSession(
  userId: string,
  token: string,
  loginMethod: 'email' | 'metamask',
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const id = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày

  await pool.execute<ResultSetHeader>(
    'INSERT INTO user_sessions (id, user_id, token, login_method, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, userId, token, loginMethod, ipAddress || null, userAgent || null, expiresAt]
  );
}

export { toPublic };
