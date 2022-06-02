import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Token } from "../typechain";

describe("ERC721 Examples", () => {
  let token: Token
  let deployer: SignerWithAddress
  let alice: SignerWithAddress
  let bob: SignerWithAddress

  beforeEach(async () => {
    [deployer, alice, bob] = await ethers.getSigners()
    token = await (await ethers.getContractFactory("Token")).deploy()
  })

  it("alice transfers to bob", async () => {
    await expect(await token.balanceOf()).to.equal(deployer.address)

    // transfer tokenId 0 from deployer to bob
    await token["safeTransferFrom(address,address,uint256)"](deployer.address, bob.address, 0);

    await expect(await token.ownerOf(0)).to.equal(bob.address)
  })

  it("approve alice to transfer an NFT from the deployer", async () => {
    // try to transfer without any approval, and expect to fail
    await expect(token.connect(alice)["safeTransferFrom(address,address,uint256)"](deployer.address, bob.address, 0))
    .to.be.revertedWith("ERC721: transfer caller is not owner nor approved")

    // now make it succeed by first getting the deployer's approval before trying to transfer
    await token.approve(alice.address, 0)
    await token.connect(alice)["safeTransferFrom(address,address,uint256)"](deployer.address, bob.address, 0)
  })

  it("setApprovalForAll", async () => {
    await expect(token.connect(alice)["safeTransferFrom(address,address,uint256)"](deployer.address, bob.address, 0))
    .to.be.revertedWith("ERC721: transfer caller is not owner nor approved")

    // now make them all succeed by setting approval for all token transfers
    await token.setApprovalForAll(alice.address, true)

    await token.connect(alice)["safeTransferFrom(address,address,uint256)"](deployer.address, bob.address, 0)
    await token.connect(alice)["safeTransferFrom(address,address,uint256)"](deployer.address, bob.address, 1)
    await token.connect(alice)["safeTransferFrom(address,address,uint256)"](deployer.address, bob.address, 2)
  })
});
