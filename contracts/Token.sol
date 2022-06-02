//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NFT is ERC20 {
    constructor() ERC20("My Token", "TOK") {
    }
}