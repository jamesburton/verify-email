// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./VerifyEmailCallerContractInterface.sol";

contract VerifyEmail is Ownable {
    uint private randNonce = 0;
    uint private modulus = 1000;
    mapping(uint => string) pendingRequests;
    event VerifyEmailRequest(address callerAddress, uint id);
    event EmailVerified(address callerAddress);
    error RequestNotPending();

    function requestVerification(string calldata email) public returns (uint) {
        randNonce++;
        uint id = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce)));
        pendingRequests[id] = email;
        emit VerifyEmailRequest(msg.sender, id);
        return id;
    }

    function verifyEmail(address _callerAddress, uint _id) public onlyOwner {
        if(bytes(pendingRequests[_id]).length == 0)
            revert RequestNotPending();
        VerifyEmailCallerContractInterface caller = VerifyEmailCallerContractInterface(_callerAddress);
        delete pendingRequests[_id];
        caller.emailVerified(_id);
        emit EmailVerified(_callerAddress);
    }
}