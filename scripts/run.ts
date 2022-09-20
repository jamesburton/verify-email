const { ethers } = require("hardhat");

const hre = (global as any).hre;

const email1 = 'james@example.com';
const email2 = 'david@example.com';

async function main() {
    // const [owner, anotherUser] = ethers.getSigners();

    const VerifyEmail = await ethers.getContractFactory("VerifyEmail");
    const verifyEmail = await VerifyEmail.deploy();
    await verifyEmail.deployed();

    console.log('Contract VerifyEmail deployed to: ', verifyEmail.address);

    verifyEmail.on("VerifyEmailRequest", (e:any) => console.log('VerifyEmailRequest: ', e));
    verifyEmail.on("EmailVerified", (e:any) => console.log('EmailVerified: ', e.id));

    const EmailCheckerExample = await ethers.getContractFactory("EmailCheckerExample");
    const emailCheckerExample = await EmailCheckerExample.deploy(verifyEmail.address);

    console.log('Contract EmailCheckerExample deployed to: ', emailCheckerExample.address);

    emailCheckerExample.on("EmailVerified", (e:any) => console.log('EmailVerified: ',e.email));

    let response = await emailCheckerExample.checkEmail(email1);
    let results = await response.wait();
    let requestEvent = results.events.find((e:any) => e.event === 'ReceivedNewVerifyEmailRequest');
    // console.log(`requestEvent: `, requestEvent);
    // console.log(`requestEvent = id: ${requestEvent.args.id}, callerAddress: ${requestEvent.args.callerAddress}`);

    response = await verifyEmail.verifyEmail(emailCheckerExample.address, requestEvent.args.id);
    await response.wait();
    console.log(`response.events: `, response.events);

    const verified = await emailCheckerExample.isVerified(email1);
    console.log(`verified (${email1}): ${verified.toString()}`);
}

async function runMain() {
    try {
        await main();
    } catch(error) {
        console.log(error);
    }
}

runMain();