// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "./VerifyEmailCallerContractInterface.sol";

contract VerifyEmailAutoResponder {
    event VerifyEmailRequest(address callerAddress, uint id, string email);
    event EmailVerified(address callerAddress);
    function requestVerification(string calldata email) public returns (uint) {
        uint _id = uint(keccak256(abi.encodePacked(email)));
        emit VerifyEmailRequest(msg.sender, _id, email);
        VerifyEmailCallerContractInterface caller = VerifyEmailCallerContractInterface(msg.sender);
        caller.emailVerified(_id);
        emit EmailVerified(msg.sender);
        return _id;
    }
}