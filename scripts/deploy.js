// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { mineUpTo } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const ipfsdata = require("../metadata/ipfs.json")
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  [buyer, seller, inspector, lender] = await ethers.getSigners()

  const Mint= await ethers.getContractFactory("Mint")
  const mint = await Mint.deploy()
  await mint.deployed()
  console.log(`Deploy Mint Contract at: ${mint.address}`)
  console.log(`Minting 3 properties... \n`)

  for (let i = 0; i < 4; i++){
    console.log(ipfsdata.data)
    const transaction = await mint.connect(seller).mint(ipfsdata.data[i])

    await transaction.wait()
  }

  const Main = await ethers.getContractFactory('Main')
  const main = await Main.deploy(
    mint.address,
    seller.address,
    inspector.address
  )
  await main.deployed()
  console.log(`Deploy Main at: ${main.address}`)
  for (let i = 0; i < 3; i++){
    const transaction = await mint.connect(seller).approve(main.address, i+1)
    await transaction.wait()
  }

  transaction = await main.connect(seller).list(1, buyer.address, tokens(0.01), tokens(0.01))
  await transaction.wait()
  transaction = await main.connect(seller).list(2, buyer.address, tokens(0.01), tokens(0.01))
  await transaction.wait()
  transaction = await main.connect(seller).list(3, buyer.address, tokens(0.01), tokens(0.01))
  await transaction.wait()
  transaction = await main.connect(seller).list(4, buyer.address, tokens(0.005), tokens(0.005))
  await transaction.wait()

  console.log("Finished.")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
