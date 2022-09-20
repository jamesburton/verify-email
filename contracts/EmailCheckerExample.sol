// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./VerifyEmailCaller.sol";

contract EmailCheckerExample is VerifyEmailCaller {
    mapping(uint => string) pendingEmails;
    event EmailVerified(string email);

    uint public verifiedCount = 0;
    mapping(uint => string) private verifiedEmails;
    mapping(uint => uint) private emailHashMap;

    constructor(address verifyEmailAddress) {
        setVerifyEmailInstanceAddress(verifyEmailAddress);
    }

    function checkEmail(string calldata email) public {
        uint id = requestEmailVerification(email);
        pendingEmails[id] = email;
    }
    
    function emailVerified(uint256 id) public override {
        string memory email = pendingEmails[id];
        delete pendingEmails[id];
        verifiedEmails[verifiedCount] = email;
        emailHashMap[uint256(keccak256(abi.encodePacked(email)))] = verifiedCount;
        verifiedCount++;
        emit EmailVerified(email);
    }

    function isVerified(string calldata email) public view returns (bool) {
        uint hash = uint256(keccak256(abi.encodePacked(email)));
        uint index = emailHashMap[hash];
        return index != 0 && bytes(verifiedEmails[index]).length > 0;
    }
}