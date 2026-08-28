package com.eventone.blockchainservice.dto;
public class BlockchainResponse {
    private String transactionHash;
    private String status;
    private String entityId;
    private String tokenId;
    
    public BlockchainResponse(String transactionHash, String status, String entityId) {
        this(transactionHash, status, entityId, null);
    }
    
    public BlockchainResponse(String transactionHash, String status, String entityId, String tokenId) {
        this.transactionHash = transactionHash;
        this.status = status;
        this.entityId = entityId;
        this.tokenId = tokenId;
    }
    
    public String getTransactionHash() { return transactionHash; }
    public String getStatus() { return status; }
    public String getEntityId() { return entityId; }
    public String getTokenId() { return tokenId; }
}
