package com.eventone.credentialservice.dto;
import com.eventone.credentialservice.domain.CredentialType;
import com.eventone.credentialservice.domain.CredentialStatus;
import java.time.Instant;
import java.util.Map;

public class CredentialResponse {
    private String id;
    private CredentialType type;
    private String title;
    private String walletAddress;
    private Map<String, String> event;
    private CredentialStatus status;
    private Map<String, Object> blockchain;
    private Instant issuedAt;
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public CredentialType getType() { return type; }
    public void setType(CredentialType type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }
    public Map<String, String> getEvent() { return event; }
    public void setEvent(Map<String, String> event) { this.event = event; }
    public CredentialStatus getStatus() { return status; }
    public void setStatus(CredentialStatus status) { this.status = status; }
    public Map<String, Object> getBlockchain() { return blockchain; }
    public void setBlockchain(Map<String, Object> blockchain) { this.blockchain = blockchain; }
    public Instant getIssuedAt() { return issuedAt; }
    public void setIssuedAt(Instant issuedAt) { this.issuedAt = issuedAt; }
}
