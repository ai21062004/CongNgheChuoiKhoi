// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;


contract Mywallet {
    address owner;
    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    function deposite() external payable {}

    function withdraw(uint256 value) onlyOwner external {
        payable (msg.sender).transfer(value); // Transfer the value to the sender's address)
    }
    function withdraw() onlyOwner external {
        payable (msg.sender).transfer(address(this).balance); // Transfer the value to the sender's address
    }
}