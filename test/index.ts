import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, waffle } from "hardhat";

import { Token } from "../typechain";

chai.use(waffle.solidity)

describe("ERC20 Examples", () => {
  let token: Token
  let deployer: SignerWithAddress
  let alice: SignerWithAddress
  let bob: SignerWithAddress

  const ONE_TOK = ethers.utils.parseEther("1") // TOK uses 18 decimals, same as ETH
  const TWO_TOK = ethers.utils.parseEther("2") // TOK uses 18 decimals, same as ETH

  beforeEach(async () => {
    [deployer, alice, bob] = await ethers.getSigners()

    // this will automatically mint 100 TOK to deployer
    token = await (await ethers.getContractFactory("Token")).deploy()
  })

  it("ERC20.transfer (push payments)", async () => {
    await expect(await token.balanceOf(bob.address)).to.equal(0)

    // transfer 1 TOK from deployer to bob
    await token.transfer(bob.address, ONE_TOK);

    await expect(await token.balanceOf(bob.address)).to.equal(ONE_TOK)
  })

  // it("ERC20.transferFrom and ERC20.approve (pull payments)", async () => {
  //   // try to transfer without any approval, and expect to fail
  //   await expect(token.connect(alice).transferFrom(deployer.address, bob.address, ONE_TOK))
  //   .to.be.revertedWith("ERC20: insufficient allowance")

  //   // now make it succeed by first getting the deployer's approval before trying to transfer
  //   await token.approve(alice.address, ONE_TOK)

  //   // make sure the allowance was updated
  //   expect(await token.allowance(deployer.address, alice.address)).to.equal(ONE_TOK)

  //   // now make the transfer
  //   await token.connect(alice).transferFrom(deployer.address, bob.address, ONE_TOK)

  //   expect(await token.balanceOf(bob.address)).to.equal(ONE_TOK)
    
  //   // what will allowance be?
  //   expect(await token.allowance(deployer.address, alice.address)).to.equal("??")
  // })

  // it("example approve race condition", async () => {
  //   await token.approve(alice.address, TWO_TOK)

  //   // Question:
  //   // If Alice observed the deployer transaction below, what ERC20 function
  //   // calls would she need to make to transfer 3 TOK from the deployer?
  //   // Note: assume this transaction below has not yet been mined
  //   await token.approve(alice.address, ONE_TOK)

  //   // ??
    
  //   expect(await token.balanceOf(alice.address)).to.equal(ONE_TOK.add(TWO_TOK))
  // })

  it("ERC20.decimals", async () => {
    expect(await token.decimals()).to.equal(18)
    // human-readable: 100 TOK
    // machine-readable: 100 * 10 ** 18, or 100_000_000_000_000_000_000
  })
});
