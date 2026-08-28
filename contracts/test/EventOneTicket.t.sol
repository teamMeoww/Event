// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/EventOneTicket.sol";

contract EventOneTicketTest is Test {
    EventOneTicket public ticket;
    address public issuer = address(0x123);
    address public attendee = address(0x456);
    bytes32 public constant eventId = keccak256("EVT_1");

    function setUp() public {
        ticket = new EventOneTicket();
        ticket.grantRole(ticket.ISSUER_ROLE(), issuer);
    }

    function testMintTicket() public {
        vm.prank(issuer);
        uint256 tokenId = ticket.mintTicket(attendee, eventId);
        
        assertEq(ticket.ownerOf(tokenId), attendee);
        
        (address owner, bytes32 evId, EventOneTicket.TicketStatus status, ) = ticket.getTicketDetails(tokenId);
        assertEq(owner, attendee);
        assertEq(evId, eventId);
        assertEq(uint(status), uint(EventOneTicket.TicketStatus.ACTIVE));
    }

    function testUnauthorizedMint() public {
        vm.prank(attendee); // Not an issuer
        vm.expectRevert();
        ticket.mintTicket(attendee, eventId);
    }

    function testRevokeTicket() public {
        vm.prank(issuer);
        uint256 tokenId = ticket.mintTicket(attendee, eventId);
        
        vm.prank(issuer);
        ticket.revoke(tokenId);
        
        (, , EventOneTicket.TicketStatus status, ) = ticket.getTicketDetails(tokenId);
        assertEq(uint(status), uint(EventOneTicket.TicketStatus.REVOKED));
    }

    function testUnauthorizedRevoke() public {
        vm.prank(issuer);
        uint256 tokenId = ticket.mintTicket(attendee, eventId);
        
        vm.prank(attendee); // Not an issuer
        vm.expectRevert();
        ticket.revoke(tokenId);
    }

    function testDuplicateMintReverts() public {
        vm.startPrank(issuer);
        ticket.mintTicket(attendee, eventId);
        
        vm.expectRevert("Attendee already has a ticket for this event");
        ticket.mintTicket(attendee, eventId);
        vm.stopPrank();
    }

    function testInvalidTokenDetails() public {
        vm.expectRevert("Nonexistent token");
        ticket.getTicketDetails(999);
    }
}
