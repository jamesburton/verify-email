// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract VerifyEmailCallerSink {
    event EmailVerified(uint256 id);
    function emailVerified(uint256 id) external {
        emit EmailVerified(id);
    }
}