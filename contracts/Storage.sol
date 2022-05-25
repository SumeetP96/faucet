// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Storage {
    /**
     * Memory Slot 1
     *
     * keccak256(key . slot)
     */
    mapping(uint256 => uint256) public aa;
    /**
     * Memory Slot 2
     */
    mapping(address => uint256) public bb;

    /**
     * Memory Slot 2
     *
     * keccak256(slot) + index of the item
     */
    uint256[] public cc; // slot 2

    /**
     * Memory Slot 3
     */
    uint8 public a = 7; // 1 byte
    uint16 public b = 10; // 2 bytes
    address public c = 0x9c7968EDB95324424257f8D8E7F2945bF0f78a9a; // 20 bytes
    bool d = true; // 1 byte
    uint64 public e = 15; // 8 bytes
    //  32 bytes / slot, above values will be stored in array of memory slot 0
    // 0x0f019c7968edb95324424257f8d8e7f2945bf0f78a9a000a07
    // 0x:hex 0f:15 01:true 9c7968edb95324424257f8d8e7f2945bf0f78a9a:address 000a:10 07:7

    /**
     * Memory Slot 4
     */
    uint256 public f = 200; // 64 bytes
    // 0xc8:200

    /**
     * Memory Slot 5
     */
    uint8 public g = 40; // 1 byte
    // 0x28:40

    /**
     * Memory Slot 6
     */
    uint256 public h = 789; // 64 bytes

    // 0x0315:789

    constructor() {
        // 0x0000000000000000000000000000000000000000000000000000000000000002 - slot 2
        // index 0 decimal - 29102676481673041902632991033461445430619272659676223336789171408008386403022
        // 405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace - keccak256 hash4
        // result - 0x01 = 1
        cc.push(1);
        // index 1 decimal - 29102676481673041902632991033461445430619272659676223336789171408008386403023
        // 405787FA12A823E0F2B7631CC41B3BA8828B3321CA811111FA75CD3AA3BB5ACF - keccak256 hash
        // result - 0x0a = 10
        cc.push(10);
        // index 2 decimal - 29102676481673041902632991033461445430619272659676223336789171408008386403024
        // 405787FA12A823E0F2B7631CC41B3BA8828B3321CA811111FA75CD3AA3BB5AD0 - keccak256 hash
        // result - 0x64 = 100
        cc.push(100);

        aa[2] = 4;
        // 0x0000000000000000000000000000000000000000000000000000000000000002 - key '2'
        // 0000000000000000000000000000000000000000000000000000000000000000 - slot 1
        // keccak256 hex decode - abbb5caa7dda850e60932de0934eb1f9d0f59695050f761dc64e443e5030a569
        // results in 0x04 = value 4

        aa[3] = 10;
        // 0x0000000000000000000000000000000000000000000000000000000000000003 - key '3'
        // 0000000000000000000000000000000000000000000000000000000000000000 - slot 1
        // keccak256 hex decode - 7dfe757ecd65cbd7922a9c0161e935dd7fdbcc0e999689c7d31633896b1fc60b
        // results in 0x0a = value 10

        bb[0x9c7968EDB95324424257f8D8E7F2945bF0f78a9a] = 100;
        // 0x0000000000000000000000009c7968EDB95324424257f8D8E7F2945bF0f78a9a - key '3'
        // 0000000000000000000000000000000000000000000000000000000000000001 - slot 2
        // keccak256 hex decode - 7dfe757ecd65cbd7922a9c0161e935dd7fdbcc0e999689c7d31633896b1fc60b
        // results in 0x64 = value 100
    }
}
