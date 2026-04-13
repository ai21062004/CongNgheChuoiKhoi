// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UserRegistry
 * @dev Smart contract lưu trữ thông tin đăng ký người dùng trên blockchain.
 *      Mỗi địa chỉ ví chỉ được đăng ký một lần.
 */
contract UserRegistry is Ownable {
    // Mapping kiểm tra wallet đã đăng ký
    mapping(address => bool) private _registered;

    // Mapping lưu thời gian đăng ký
    mapping(address => uint256) private _registeredAt;

    // Tổng số user đã đăng ký
    uint256 private _userCount;

    // Events
    event UserRegistered(address indexed wallet, uint256 timestamp);
    event UserRemoved(address indexed wallet, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Đăng ký user mới. Chỉ owner (backend) mới có quyền gọi.
     * @param wallet Địa chỉ ví MetaMask của user
     */
    function registerUser(address wallet) external onlyOwner {
        require(wallet != address(0), "Invalid wallet address");
        require(!_registered[wallet], "Wallet already registered");

        _registered[wallet] = true;
        _registeredAt[wallet] = block.timestamp;
        _userCount++;

        emit UserRegistered(wallet, block.timestamp);
    }

    /**
     * @dev Kiểm tra wallet đã đăng ký chưa
     */
    function isRegistered(address wallet) external view returns (bool) {
        return _registered[wallet];
    }

    /**
     * @dev Lấy thời gian đăng ký của wallet
     */
    function getRegisteredAt(address wallet) external view returns (uint256) {
        require(_registered[wallet], "Wallet not registered");
        return _registeredAt[wallet];
    }

    /**
     * @dev Tổng số user đã đăng ký
     */
    function getUserCount() external view returns (uint256) {
        return _userCount;
    }

    /**
     * @dev Xoá user (admin only) - dùng cho trường hợp khoá tài khoản
     */
    function removeUser(address wallet) external onlyOwner {
        require(_registered[wallet], "Wallet not registered");

        _registered[wallet] = false;
        _userCount--;

        emit UserRemoved(wallet, block.timestamp);
    }
}
