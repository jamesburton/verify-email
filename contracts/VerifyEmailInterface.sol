// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

abstract contract VerifyEmailInterface {
    function requestVerification(string memory email) virtual public returns (uint256);
}