// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./VerifyEmailInterface.sol";
import "./VerifyEmailCallerContractInterface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract VerifyEmailCaller is Ownable {
    VerifyEmailInterface private _verifyEmailInterface;
    address private _verifyEmailInstanceAddress;
    mapping(uint => bool) private _verifyEmailRequests;
    
    event NewVerifyEmailInstanceAddress(address verifyEmailInstanceAddress);
    event ReceivedNewVerifyEmailRequest(uint256 id);

    function setVerifyEmailInstanceAddress (address verifyEmailInstanceAddress) public onlyOwner {
        _verifyEmailInstanceAddress = verifyEmailInstanceAddress;
        _verifyEmailInterface = VerifyEmailInterface(_verifyEmailInstanceAddress);
        emit NewVerifyEmailInstanceAddress(verifyEmailInstanceAddress);
    }

    function requestEmailVerification(string calldata email) public returns (uint256) {
        uint256 id = _verifyEmailInterface.requestVerification(email);
        _verifyEmailRequests[id] = true;
        emit ReceivedNewVerifyEmailRequest(id);
        return id;
    }

    function emailVerified(uint256 id) public virtual;
}