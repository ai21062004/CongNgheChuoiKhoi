// ============================================
// Auth Controller - Request Handlers
// ============================================
import { Request, Response } from 'express';
import * as authService from '../services/authService';

/**
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, walletAddress, signature, message } = req.body;

    const result = await authService.register(
      { name, email, password, walletAddress, signature, message },
      req.ip,
      req.headers['user-agent']
    );

    res.status(201).json({
      message: 'Đăng ký thành công',
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('đã được') ? 409 : 400;
    res.status(statusCode).json({ error: error.message });
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const result = await authService.loginEmail(
      { email, password },
      req.ip,
      req.headers['user-agent']
    );

    res.json({
      message: 'Đăng nhập thành công',
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

/**
 * POST /api/auth/login-wallet
 */
export async function loginWallet(req: Request, res: Response): Promise<void> {
  try {
    const { walletAddress, signature, message } = req.body;

    const result = await authService.loginWallet(
      { walletAddress, signature, message },
      req.ip,
      req.headers['user-agent']
    );

    res.json({
      message: 'Đăng nhập bằng ví thành công',
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('chưa được đăng ký') ? 404 : 401;
    res.status(statusCode).json({ error: error.message });
  }
}

/**
 * GET /api/auth/me
 */
export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Chưa xác thực' });
      return;
    }

    const user = await authService.getMe(req.user.userId);
    res.json({ user });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}
