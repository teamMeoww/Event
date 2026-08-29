// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/access/AccessControl.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";

contract EventOneTicket is ERC721, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    enum TicketStatus { ACTIVE, CANCELLED, REVOKED, USED }

    struct TicketData {
        bytes32 eventId;
        TicketStatus status;
        uint64 issuedAt;
    }

    uint256 private _nextTokenId = 1;
    mapping(uint256 => TicketData) public ticketDetails;
    mapping(address => mapping(bytes32 => bool)) public hasTicket;

    event TicketMinted(uint256 indexed tokenId, bytes32 indexed eventId, address indexed attendee);
    event TicketStatusChanged(uint256 indexed tokenId, TicketStatus status);
    
    error TicketIsSoulbound();
    error InvalidAttendee();
    error AttendeeAlreadyHasTicket();
    error NonexistentToken();
    error TicketNotActive();
    error TicketCannotBeRevoked();

    constructor() ERC721("EventOneTicket", "E1T") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    function mintTicket(address attendee, bytes32 eventId) external onlyRole(ISSUER_ROLE) returns (uint256) {
        if (attendee == address(0)) revert InvalidAttendee();
        if (hasTicket[attendee][eventId]) revert AttendeeAlreadyHasTicket();
        
        uint256 tokenId = _nextTokenId++;
        
        ticketDetails[tokenId] = TicketData({
            eventId: eventId,
            status: TicketStatus.ACTIVE,
            issuedAt: uint64(block.timestamp)
        });

        _safeMint(attendee, tokenId);
        hasTicket[attendee][eventId] = true;
        
        emit TicketMinted(tokenId, eventId, attendee);
        return tokenId;
    }

    function cancel(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        if (_ownerOf(tokenId) == address(0)) revert NonexistentToken();
        if (ticketDetails[tokenId].status != TicketStatus.ACTIVE) revert TicketNotActive();
        
        ticketDetails[tokenId].status = TicketStatus.CANCELLED;
        emit TicketStatusChanged(tokenId, TicketStatus.CANCELLED);
    }

    function revoke(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        if (_ownerOf(tokenId) == address(0)) revert NonexistentToken();
        if (ticketDetails[tokenId].status == TicketStatus.REVOKED || ticketDetails[tokenId].status == TicketStatus.CANCELLED) revert TicketCannotBeRevoked();
        
        ticketDetails[tokenId].status = TicketStatus.REVOKED;
        emit TicketStatusChanged(tokenId, TicketStatus.REVOKED);
    }

    function markUsed(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        if (_ownerOf(tokenId) == address(0)) revert NonexistentToken();
        if (ticketDetails[tokenId].status != TicketStatus.ACTIVE) revert TicketNotActive();
        
        ticketDetails[tokenId].status = TicketStatus.USED;
        emit TicketStatusChanged(tokenId, TicketStatus.USED);
    }

    function getTicketDetails(uint256 tokenId) external view returns (address owner, bytes32 eventId, TicketStatus status, uint64 issuedAt) {
        if (_ownerOf(tokenId) == address(0)) revert NonexistentToken();
        TicketData memory data = ticketDetails[tokenId];
        return (ownerOf(tokenId), data.eventId, data.status, data.issuedAt);
    }
    
    function isValidTicket(uint256 tokenId) external view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) {
            return false;
        }
        return ticketDetails[tokenId].status == TicketStatus.ACTIVE;
    }

    // --- SOULBOUND IMPLEMENTATION --- //

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert TicketIsSoulbound();
        }
        return super._update(to, tokenId, auth);
    }
    
    function approve(address to, uint256 tokenId) public override {
        revert TicketIsSoulbound();
    }
    
    function setApprovalForAll(address operator, bool approved) public override {
        revert TicketIsSoulbound();
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
