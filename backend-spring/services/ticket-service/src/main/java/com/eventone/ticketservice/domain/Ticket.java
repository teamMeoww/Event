package com.eventone.ticketservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String publicId;
    
    @Indexed(unique = true)
    private String registrationId;
    
    @Indexed
    private String userId;
    
    @Indexed
    private String eventId;
    
    private String ticketType;
    
    @Indexed
    private TicketStatus status;
    private String walletAddress;
    
    @Indexed
    private QrData qr;
    
    private boolean used;
    private Instant usedAt;

    private boolean blockchainEnabled;
    private String blockchainStatus;
    private String blockchainTicketId;
    private String transactionHash;
    
    private Instant issuedAt;
    private Instant updatedAt;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }
    public String getRegistrationId() { return registrationId; }
    public void setRegistrationId(String registrationId) { this.registrationId = registrationId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getTicketType() { return ticketType; }
    public void setTicketType(String ticketType) { this.ticketType = ticketType; }
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }
    public QrData getQr() { return qr; }
    public void setQr(QrData qr) { this.qr = qr; }
    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }
    public Instant getUsedAt() { return usedAt; }
    public void setUsedAt(Instant usedAt) { this.usedAt = usedAt; }
    public boolean isBlockchainEnabled() { return blockchainEnabled; }
    public void setBlockchainEnabled(boolean blockchainEnabled) { this.blockchainEnabled = blockchainEnabled; }
    public String getBlockchainStatus() { return blockchainStatus; }
    public void setBlockchainStatus(String blockchainStatus) { this.blockchainStatus = blockchainStatus; }
    public String getBlockchainTicketId() { return blockchainTicketId; }
    public void setBlockchainTicketId(String blockchainTicketId) { this.blockchainTicketId = blockchainTicketId; }
    public String getTransactionHash() { return transactionHash; }
    public void setTransactionHash(String transactionHash) { this.transactionHash = transactionHash; }
    public Instant getIssuedAt() { return issuedAt; }
    public void setIssuedAt(Instant issuedAt) { this.issuedAt = issuedAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
