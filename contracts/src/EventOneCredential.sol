// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "openzeppelin-contracts/contracts/access/AccessControl.sol";

contract EventOneCredential is ERC721URIStorage, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    enum CredentialStatus { VALID, REVOKED }

    struct CredentialData {
        bytes32 eventId;
        bytes32 credentialType;
        CredentialStatus status;
        uint64 issuedAt;
    }

    uint256 private _nextTokenId;
    mapping(uint256 => CredentialData) public credentialDetails;

    event CredentialIssued(uint256 indexed tokenId, bytes32 indexed eventId, address indexed attendee);
    event CredentialRevoked(uint256 indexed tokenId);

    constructor() ERC721("EventOneCredential", "E1C") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    function issueCredential(
        address attendee,
        bytes32 eventId,
        bytes32 credentialType,
        string calldata uri
    ) external onlyRole(ISSUER_ROLE) returns (uint256) {
        require(attendee != address(0), "Invalid attendee address");
        
        uint256 tokenId = _nextTokenId++;
        
        credentialDetails[tokenId] = CredentialData({
            eventId: eventId,
            credentialType: credentialType,
            status: CredentialStatus.VALID,
            issuedAt: uint64(block.timestamp)
        });

        _safeMint(attendee, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit CredentialIssued(tokenId, eventId, attendee);
        return tokenId;
    }

    function revokeCredential(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        require(credentialDetails[tokenId].status == CredentialStatus.VALID, "Already revoked");
        
        credentialDetails[tokenId].status = CredentialStatus.REVOKED;
        emit CredentialRevoked(tokenId);
    }
    
    function isValidCredential(uint256 tokenId) external view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) {
            return false;
        }
        return credentialDetails[tokenId].status == CredentialStatus.VALID;
    }

    function getCredentialDetails(uint256 tokenId) external view returns (
        address owner, 
        bytes32 eventId, 
        bytes32 credentialType, 
        CredentialStatus status, 
        uint64 issuedAt,
        string memory uri
    ) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        CredentialData memory data = credentialDetails[tokenId];
        return (ownerOf(tokenId), data.eventId, data.credentialType, data.status, data.issuedAt, tokenURI(tokenId));
    }

    // --- Non-transferable override ---
    // OpenZeppelin v5 uses _update for transfers. If from != address(0) (not minting) and to != address(0) (not burning), revert.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Credentials are non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
