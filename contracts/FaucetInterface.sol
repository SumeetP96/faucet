// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// interface rules

// Intefaces cannot inherit from other smart conracts

// But they can inherit from other interfaces

// They cannot declare a constructor

// The cannot declare state variables

// All the functions sould be external

interface FaucetInterface {
    function addFunds() external payable;

    function withdraw(uint256 withdrawAmount) external;
}
