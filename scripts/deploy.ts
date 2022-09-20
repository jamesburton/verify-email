const { ethers } = require("hardhat");

const hre = (global as any).hre;

async function main() {
    // const [owner, anotherUser] = ethers.getSigners();

    const VerifyEmail = await ethers.getContractFactory("VerifyEmail");
    const verifyEmail = await VerifyEmail.deploy();
    await verifyEmail.deployed();

    const verifyEmailAddress = verifyEmail.address;
    console.log('Contract VerifyEmail deployed to: ', verifyEmailAddress);

    const EmailCheckerExample = await ethers.getContractFactory("EmailCheckerExample");
    const emailCheckerExample = await EmailCheckerExample.deploy(verifyEmailAddress);

    console.log('Contract EmailCheckerExample deployed to: ', emailCheckerExample.address);
}

async function runMain() {
    try {
        await main();
    } catch(error) {
        console.log(error);
    }
}

runMain();