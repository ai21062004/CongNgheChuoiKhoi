// ============================================
// Auth Routes
// ============================================
import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { validateRegister, validateLogin, validateLoginWallet } from '../middleware/validate';

const router = Router();

// POST /api/auth/register - Đăng ký tài khoản
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login - Đăng nhập bằng email/password
router.post('/login', validateLogin, authController.login);

// POST /api/auth/login-wallet - Đăng nhập bằng MetaMask
router.post('/login-wallet', validateLoginWallet, authController.loginWallet);

// GET /api/auth/me - Lấy thông tin user hiện tại (cần JWT)
router.get('/me', authMiddleware, authController.getMe);

export default router;
