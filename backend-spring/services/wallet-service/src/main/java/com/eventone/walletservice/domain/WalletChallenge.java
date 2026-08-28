package com.eventone.walletservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

@RedisHash("wallet:challenge")
public class WalletChallenge {
    @Id
    private String nonce; // UUID or secure random hex
    private String userId;
    private String address;
    private String purpose;
    private Instant createdAt;
    
    @TimeToLive(unit = TimeUnit.SECONDS)
    private Long timeToLive;

    // Getters and Setters
    public String getNonce() { return nonce; }
    public void setNonce(String nonce) { this.nonce = nonce; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Long getTimeToLive() { return timeToLive; }
    public void setTimeToLive(Long timeToLive) { this.timeToLive = timeToLive; }
}
