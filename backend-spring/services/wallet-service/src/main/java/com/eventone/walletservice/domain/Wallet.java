package com.eventone.walletservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "wallets")
public class Wallet {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    @Indexed
    private String address;
    private String chain;
    private String chainId;
    private String walletType;
    private boolean verified;
    private Instant createdAt;
    private Instant verifiedAt;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getChain() { return chain; }
    public void setChain(String chain) { this.chain = chain; }
    public String getChainId() { return chainId; }
    public void setChainId(String chainId) { this.chainId = chainId; }
    public String getWalletType() { return walletType; }
    public void setWalletType(String walletType) { this.walletType = walletType; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }
}
