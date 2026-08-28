// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/EventOneCredential.sol";

contract EventOneCredentialTest is Test {
    EventOneCredential public credential;
    address public issuer = address(0x123);
    address public attendee = address(0x456);
    address public other = address(0x789);
    bytes32 public constant eventId = keccak256("EVT_1");
    bytes32 public constant credType = keccak256("POA");

    function setUp() public {
        credential = new EventOneCredential();
        credential.grantRole(credential.ISSUER_ROLE(), issuer);
    }

    function testIssueCredential() public {
        vm.prank(issuer);
        uint256 tokenId = credential.issueCredential(attendee, eventId, credType, "ipfs://test");
        assertEq(credential.ownerOf(tokenId), attendee);
        assertTrue(credential.isValidCredential(tokenId));
    }

    function testNonTransferable() public {
        vm.prank(issuer);
        uint256 tokenId = credential.issueCredential(attendee, eventId, credType, "ipfs://test");
        
        vm.prank(attendee);
        vm.expectRevert("Credentials are non-transferable");
        credential.transferFrom(attendee, other, tokenId);
    }
}
