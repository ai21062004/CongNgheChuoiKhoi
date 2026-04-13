// ============================================
// Validation Middleware
// ============================================
import { Request, Response, NextFunction } from 'express';

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  const { name, email, password, walletAddress, signature, message } = req.body;

  if (!name || !email || !password || !walletAddress || !signature || !message) {
    res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    return;
  }

  if (typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Tên phải có ít nhất 2 ký tự' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Email không hợp lệ' });
    return;
  }

  if (typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
    return;
  }

  const walletRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!walletRegex.test(walletAddress)) {
    res.status(400).json({ error: 'Địa chỉ ví không hợp lệ' });
    return;
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' });
    return;
  }

  next();
}

export function validateLoginWallet(req: Request, res: Response, next: NextFunction): void {
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    res.status(400).json({ error: 'Thiếu thông tin xác thực ví' });
    return;
  }

  const walletRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!walletRegex.test(walletAddress)) {
    res.status(400).json({ error: 'Địa chỉ ví không hợp lệ' });
    return;
  }

  next();
}
