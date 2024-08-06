const { serialize } = require('@ethersproject/transactions');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { isNamespaceExport } = require('typescript');
const { data } = require('../metadata/3.json')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Main', () => {
    let buyer, seller
    let mint, Main

    beforeEach(async () => {
        [buyer, seller] = await ethers.getSigners()
        //Deploy test
        const Mint= await ethers.deployContract("Mint")
        mint = Mint
        console.log(mint)
        //Test mint
        let transaction = await mint.connect(seller).mint("https://bafybeiegsnqhyjzanoxmwh2wc2bcnc5g6hhdadjxmzedbv4bf734b4lhtm.ipfs.cf-ipfs.com/")
        transaction = await mint.connect(seller).mint("https://bafybeiegsnqhyjzanoxmwh2wc2bcnc5g6hhdadjxmzedbv4bf734b4lhtm.ipfs.cf-ipfs.com/")
        await transaction.wait()
        Main = await ethers.deployContract("Main", [mint.address])
        //list property
        transaction = await mint.connect(seller).approve(Main.address, 1)
        await transaction.wait()
        transaction = await Main.connect(seller).list(1, tokens(0.01), tokens(0.01))
        await transaction.wait()
        
    })

    describe("Deployment", () => {
        it("Return NFT address", async() => {
            const result = await Main.nftAddress()
            console.log(result)
            expect(result).to.be.equal(mint.address)
        })
    })
    describe("Check Listed", () => {
        it("Return NFT address", async() => {
            let result = await mint.ownerOf(1)
            expect(result).to.be.equal(Main.address)
            result = await mint.ownerOf(2)
            expect(result).to.be.equal(seller.address)
        })
    })

    describe("Buy NFT", () => {
        it("NFT transfer to Buyer address", async() => {
            //check list
            var result =  await Main.isListed(1);
            console.log(result)
            //check buyer
            result =  await Main.buyer(0);
            console.log(result)
            //check price
            result =  await Main.purchasePrice(1);
            console.log(result)
            let transaction = await Main.connect(buyer).depositEarnest(1, { value: tokens(0.01) })
            await transaction.wait()
            result = await Main.getBalance()
            expect(result).to.be.equal(tokens(0.01))
            transaction = await Main.connect(seller).approveSale(1)
            await transaction.wait()
            transaction = await Main.connect(buyer).approveSale(1)
            await transaction.wait()
            result =  await Main.approval(1, seller.address);
            console.log(result)
            result =  await Main.approval(1, buyer.address);
            transaction = await Main.connect(seller).finalizeSale(1, seller.address)
            await transaction.wait()
            expect(await mint.ownerOf(1)).to.be.equal(buyer.address)
            expect(await Main.getBalance()).to.be.equal(0)
        })
    })

})
