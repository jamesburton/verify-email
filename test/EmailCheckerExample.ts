import { expect } from "chai";
import { /*time,*/ loadFixture } from "@nomicfoundation/hardhat-network-helpers";
const email1 = 'user1@example.com';
// const email2 = 'user2@example.com';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const deployFixture = async function() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const VerifyEmailAutoResponder = await ethers.getContractFactory("VerifyEmailAutoResponder");
    const verifyEmailContract = await VerifyEmailAutoResponder.deploy();
    const VerifyEmail = await ethers.getContractFactory("EmailCheckerExample");
    const contract = await VerifyEmail.deploy(verifyEmailContract.address);
    return { contract, owner, otherAccount, verifyEmailContract };
};

describe("EmailCheckerExample", async () => {
    it("Can request verification with reverting", async () => {
        const { contract } = await loadFixture(deployFixture);
        await expect(contract.checkEmail(email1)).not.to.be.reverted;
    });
    it("Requesting verification calls configured VerifyEmail", async () => {
        const { contract, verifyEmailContract } = await loadFixture(deployFixture);
        let request:any = undefined;
        // verifyEmailContract.on("VerifyEmailRequest", (e:any) => {
        //     console.log("VerifyEmailRequest: ", e);
        //     request = e;
        // });
        const response = await contract.checkEmail(email1);
        const results = await response.wait();
        await sleep(500);
        const requestedEvent = results.events.find((e:any) => e.event === 'ReceivedNewVerifyEmailRequest');
        // console.log('Checking requestedEvent');
        // console.log('requestedEvent: ', requestedEvent);
        expect(requestedEvent).not.to.be.undefined;
        expect(requestedEvent.args).not.to.be.undefined;
        expect(requestedEvent.args.id).not.to.be.undefined;
        request = results.events.find((e:any) => e.event === 'EmailVerified');
        // console.log('Checking request');
        expect(request).not.to.be.undefined;
        expect(request.args).not.to.be.undefined;
        // console.log(`request: `, request);
        // expect(request.args.email).to.equal(email1); // This doesn't work as the callback arives before the response stores the email
    });
    it("Emits EmailVerified when emailVerified is called", async () => {
        const { contract } = await loadFixture(deployFixture);
        const response = await contract.checkEmail(email1);
        const results = await response.wait();
        const requestedEvent = results.events.find((e:any) => e.event === 'ReceivedNewVerifyEmailRequest');
        await expect(contract.emailVerified(requestedEvent.args.id))
            .to.emit(contract, "EmailVerified")
            .withArgs(email1);
    });
    it("Returns false for isVerified without verifying any emails", async () => {
        const { contract } = await loadFixture(deployFixture);
        expect(await contract.isVerified(email1)).to.equal(false);
    });
    it("Returns true for isVerified for verified email", async () => {
        const { contract } = await loadFixture(deployFixture);
        const response = await contract.checkEmail(email1);
        const results = await response.wait();
        const requestedEvent = results.events.find((e:any) => e.event === 'ReceivedNewVerifyEmailRequest');
        await contract.emailVerified(requestedEvent.args.id);
        expect(await contract.isVerified(email1)).to.equal(true);
    });
});