// ============================================
// Ethereum Utilities - Verify MetaMask Signature
// ============================================
import { ethers } from 'ethers';

/**
 * Xác minh chữ ký MetaMask (personal_sign)
 * @param message - Message gốc đã ký
 * @param signature - Chữ ký từ MetaMask
 * @param expectedAddress - Địa chỉ ví mong đợi
 * @returns true nếu chữ ký hợp lệ
 */
export function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * Tạo message để user ký khi đăng nhập/đăng ký
 */
export function createSignMessage(action: 'login' | 'register', nonce: string): string {
  return `BlockData ${action === 'login' ? 'Login' : 'Register'}: ${nonce}`;
}
