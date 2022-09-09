// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Receives an ERC20 and sends it to the given addresses
contract PaymentSplitter {
    /// @notice accepts some amount of a given token, and splits it evenly amongst the given addresses
    /// @dev For simplicity the amount must be evenly divisible by the number of _addrs, or else it reverts
    function split(
        IERC20 token,
        uint256 amount,
        address[] calldata _addrs
    ) external payable {
        require(amount > 0, "must send in non-zero amount");

        uint256 numAddrs = _addrs.length;
        uint256 amountToSend = amount / _addrs.length;
        require(
            amountToSend * numAddrs == amount,
            "amount must be evenly divisible by the number of input addresses"
        );

        // pull in the funds from the user
        token.transferFrom(msg.sender, address(this), amount);

        // disburse funds
        for (uint256 i = 0; i < numAddrs; i++) {
            token.transfer(_addrs[i], amountToSend);
        }
    }
}
