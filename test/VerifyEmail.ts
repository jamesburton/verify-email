import { expect } from "chai";
import { /*time,*/ loadFixture } from "@nomicfoundation/hardhat-network-helpers";
const email1 = 'user1@example.com';
// const email2 = 'user2@example.com';

const deployFixture = async function() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const VerifyEmail = await ethers.getContractFactory("VerifyEmail");
    const contract = await VerifyEmail.deploy();
    const VerifyEmailCallerSink = await ethers.getContractFactory("VerifyEmailCallerSink");
    const sink = await VerifyEmailCallerSink.deploy();
    return { contract, owner, otherAccount, sinkAddress: sink.address };
};
// const deployProxyFixture = async function() {
//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await ethers.getSigners();
//     const VerifyEmailV1 = await ethers.getContractFactory("VerifyEmailV1");
//     const contract = await hre.upgrades.deployProxy(VerifyEmailV1);
//     return { contract, owner, otherAccount };
// };

describe("VerifyEmail", function() {
    // Tests
    /*
    it("", async function() {
        const { contract } = await loadFixture(deployFixture);
    });
    */
    it("Emits VerifyEmailRequest event when called", async function() {
        const { contract } = await loadFixture(deployFixture);
        await expect(contract.requestVerification(email1))
            .to.emit(contract, "VerifyEmailRequest");
    });
    it("Emits EmailVerified event when called", async function() {
        const { contract, sinkAddress } = await loadFixture(deployFixture);
        const response = await contract.requestVerification(email1);
        const results = await response.wait();
        const verifyEmailRequestEvent = results.events.find((e:any) => e.event === 'VerifyEmailRequest');
        await expect(contract.verifyEmail(sinkAddress, verifyEmailRequestEvent.args.id))
            .to.emit(contract, "EmailVerified")
            .withArgs(sinkAddress);
    });
});