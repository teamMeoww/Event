package com.eventone.blockchainservice.dto;
public class BlockchainResponse {
    private String transactionHash;
    private String status;
    private String entityId;
    public BlockchainResponse(String transactionHash, String status, String entityId) {
        this.transactionHash = transactionHash;
        this.status = status;
        this.entityId = entityId;
    }
    public String getTransactionHash() { return transactionHash; }
    public String getStatus() { return status; }
    public String getEntityId() { return entityId; }
}
