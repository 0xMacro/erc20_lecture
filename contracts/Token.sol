//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("My Token", "TOK") {
        // mint 100 TOK to the deployer
        _mint(msg.sender, 100 * 10**decimals());
    }
}
