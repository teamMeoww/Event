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

    function testUnauthorizedMint() public {
        vm.prank(attendee); // Not an issuer
        vm.expectRevert();
        credential.issueCredential(attendee, eventId, credType, "ipfs://test");
    }

    function testRevokeCredential() public {
        vm.prank(issuer);
        uint256 tokenId = credential.issueCredential(attendee, eventId, credType, "ipfs://test");
        
        vm.prank(issuer);
        credential.revokeCredential(tokenId);
        
        assertFalse(credential.isValidCredential(tokenId));
    }

    function testUnauthorizedRevoke() public {
        vm.prank(issuer);
        uint256 tokenId = credential.issueCredential(attendee, eventId, credType, "ipfs://test");
        
        vm.prank(attendee); // Not an issuer
        vm.expectRevert();
        credential.revokeCredential(tokenId);
    }

    function testDuplicateMintReverts() public {
        vm.startPrank(issuer);
        credential.issueCredential(attendee, eventId, credType, "ipfs://test");
        
        vm.expectRevert("Attendee already has this credential type for this event");
        credential.issueCredential(attendee, eventId, credType, "ipfs://test");
        vm.stopPrank();
    }

    function testMetadataAndDetails() public {
        vm.prank(issuer);
        uint256 tokenId = credential.issueCredential(attendee, eventId, credType, "ipfs://test1234");
        
        (address owner, bytes32 evId, bytes32 cType, EventOneCredential.CredentialStatus status, , string memory uri) = credential.getCredentialDetails(tokenId);
        
        assertEq(owner, attendee);
        assertEq(evId, eventId);
        assertEq(cType, credType);
        assertEq(uint(status), uint(EventOneCredential.CredentialStatus.VALID));
        assertEq(uri, "ipfs://test1234");
    }

    function testInvalidTokenDetails() public {
        vm.expectRevert("Nonexistent token");
        credential.getCredentialDetails(999);
    }
}
