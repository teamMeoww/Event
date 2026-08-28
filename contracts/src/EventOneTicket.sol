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

    uint256 private _nextTokenId;
    mapping(uint256 => TicketData) public ticketDetails;

    event TicketMinted(uint256 indexed tokenId, bytes32 indexed eventId, address indexed attendee);
    event TicketStatusChanged(uint256 indexed tokenId, TicketStatus status);

    constructor() ERC721("EventOneTicket", "E1T") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    function mintTicket(address attendee, bytes32 eventId) external onlyRole(ISSUER_ROLE) returns (uint256) {
        require(attendee != address(0), "Invalid attendee address");
        
        uint256 tokenId = _nextTokenId++;
        
        ticketDetails[tokenId] = TicketData({
            eventId: eventId,
            status: TicketStatus.ACTIVE,
            issuedAt: uint64(block.timestamp)
        });

        _safeMint(attendee, tokenId);
        
        emit TicketMinted(tokenId, eventId, attendee);
        return tokenId;
    }

    function cancel(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        require(ticketDetails[tokenId].status == TicketStatus.ACTIVE, "Cannot cancel non-active ticket");
        
        ticketDetails[tokenId].status = TicketStatus.CANCELLED;
        emit TicketStatusChanged(tokenId, TicketStatus.CANCELLED);
    }

    function revoke(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        require(ticketDetails[tokenId].status != TicketStatus.REVOKED, "Already revoked");
        
        ticketDetails[tokenId].status = TicketStatus.REVOKED;
        emit TicketStatusChanged(tokenId, TicketStatus.REVOKED);
    }

    function markUsed(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        require(ticketDetails[tokenId].status == TicketStatus.ACTIVE, "Ticket not active");
        
        ticketDetails[tokenId].status = TicketStatus.USED;
        emit TicketStatusChanged(tokenId, TicketStatus.USED);
    }

    function getTicketDetails(uint256 tokenId) external view returns (address owner, bytes32 eventId, TicketStatus status, uint64 issuedAt) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        TicketData memory data = ticketDetails[tokenId];
        return (ownerOf(tokenId), data.eventId, data.status, data.issuedAt);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
