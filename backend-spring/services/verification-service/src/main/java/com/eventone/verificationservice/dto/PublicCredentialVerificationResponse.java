package com.eventone.verificationservice.dto;

public class PublicCredentialVerificationResponse {
    private String type = "CREDENTIAL";
    private String credentialId;
    private String credentialType;
    private String title;
    private EventInfo event;
    private String status;
    private String issuedAt;
    private BlockchainInfo blockchain;
    
    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCredentialId() { return credentialId; }
    public void setCredentialId(String credentialId) { this.credentialId = credentialId; }
    public String getCredentialType() { return credentialType; }
    public void setCredentialType(String credentialType) { this.credentialType = credentialType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public EventInfo getEvent() { return event; }
    public void setEvent(EventInfo event) { this.event = event; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getIssuedAt() { return issuedAt; }
    public void setIssuedAt(String issuedAt) { this.issuedAt = issuedAt; }
    public BlockchainInfo getBlockchain() { return blockchain; }
    public void setBlockchain(BlockchainInfo blockchain) { this.blockchain = blockchain; }
}
