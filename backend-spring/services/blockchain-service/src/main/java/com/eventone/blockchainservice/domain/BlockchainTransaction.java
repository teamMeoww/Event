package com.eventone.blockchainservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "blockchain_transactions")
@CompoundIndex(def = "{'entityType': 1, 'entityId': 1, 'operation': 1}", unique = true)
public class BlockchainTransaction {
    @Id
    private String id;
    private String entityType; // TICKET, CREDENTIAL, EVENT
    private String entityId;
    private String operation; // MINT, REVOKE
    private String chainId;
    private String contractAddress;
    private String transactionHash;
    private String status; // QUEUED, SUBMITTED, PENDING, CONFIRMED, FAILED, REVERTED
    private Long blockNumber;
    private String lastError;
    private Instant submittedAt;
    private Instant confirmedAt;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }
    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }
    public String getChainId() { return chainId; }
    public void setChainId(String chainId) { this.chainId = chainId; }
    public String getContractAddress() { return contractAddress; }
    public void setContractAddress(String contractAddress) { this.contractAddress = contractAddress; }
    public String getTransactionHash() { return transactionHash; }
    public void setTransactionHash(String transactionHash) { this.transactionHash = transactionHash; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getBlockNumber() { return blockNumber; }
    public void setBlockNumber(Long blockNumber) { this.blockNumber = blockNumber; }
    public String getLastError() { return lastError; }
    public void setLastError(String lastError) { this.lastError = lastError; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
    public Instant getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(Instant confirmedAt) { this.confirmedAt = confirmedAt; }
}
