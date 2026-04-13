// ============================================
// Auth Service - Business Logic
// ============================================
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { verifySignature } from '../utils/ethereum';
import * as UserModel from '../models/User';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  walletAddress: string;
  signature: string;
  message: string;
}

export interface LoginEmailInput {
  email: string;
  password: string;
}

export interface LoginWalletInput {
  walletAddress: string;
  signature: string;
  message: string;
}

/**
 * Đăng ký tài khoản mới
 */
export async function register(
  input: RegisterInput,
  ip?: string,
  userAgent?: string
) {
  // 1. Verify chữ ký MetaMask
  const isValidSig = verifySignature(input.message, input.signature, input.walletAddress);
  if (!isValidSig) {
    throw new Error('Chữ ký MetaMask không hợp lệ');
  }

  // 2. Kiểm tra email đã tồn tại
  const existingEmail = await UserModel.findByEmail(input.email);
  if (existingEmail) {
    throw new Error('Email đã được sử dụng');
  }

  // 3. Kiểm tra wallet đã tồn tại
  const existingWallet = await UserModel.findByWallet(input.walletAddress);
  if (existingWallet) {
    throw new Error('Địa chỉ ví đã được liên kết với tài khoản khác');
  }

  // 4. Hash password
  const passwordHash = await bcrypt.hash(input.password, 10);

  // 5. Tạo user
  const user = await UserModel.createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    walletAddress: input.walletAddress,
  });

  // 6. Tạo JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    walletAddress: user.walletAddress,
  });

  // 7. Lưu session
  await UserModel.createSession(user.id, token, 'email', ip, userAgent);

  return { token, user };
}

/**
 * Đăng nhập bằng Email + Password
 */
export async function loginEmail(
  input: LoginEmailInput,
  ip?: string,
  userAgent?: string
) {
  // 1. Tìm user theo email
  const userRow = await UserModel.findByEmail(input.email);
  if (!userRow) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // 2. So sánh password
  const isMatch = await bcrypt.compare(input.password, userRow.password_hash);
  if (!isMatch) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // 3. Tạo JWT
  const user = UserModel.toPublic(userRow);
  const token = generateToken({
    userId: user.id,
    email: user.email,
    walletAddress: user.walletAddress,
  });

  // 4. Lưu session
  await UserModel.createSession(user.id, token, 'email', ip, userAgent);

  return { token, user };
}

/**
 * Đăng nhập bằng MetaMask Wallet
 */
export async function loginWallet(
  input: LoginWalletInput,
  ip?: string,
  userAgent?: string
) {
  // 1. Verify chữ ký
  const isValidSig = verifySignature(input.message, input.signature, input.walletAddress);
  if (!isValidSig) {
    throw new Error('Chữ ký MetaMask không hợp lệ');
  }

  // 2. Tìm user theo wallet
  const userRow = await UserModel.findByWallet(input.walletAddress);
  if (!userRow) {
    throw new Error('Ví chưa được đăng ký. Vui lòng tạo tài khoản trước.');
  }

  // 3. Tạo JWT
  const user = UserModel.toPublic(userRow);
  const token = generateToken({
    userId: user.id,
    email: user.email,
    walletAddress: user.walletAddress,
  });

  // 4. Lưu session
  await UserModel.createSession(user.id, token, 'metamask', ip, userAgent);

  return { token, user };
}

/**
 * Lấy thông tin user hiện tại từ userId
 */
export async function getMe(userId: string) {
  const userRow = await UserModel.findById(userId);
  if (!userRow) {
    throw new Error('Không tìm thấy người dùng');
  }
  return UserModel.toPublic(userRow);
}
