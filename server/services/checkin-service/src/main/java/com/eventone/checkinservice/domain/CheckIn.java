package com.eventone.checkinservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "checkins")
public class CheckIn {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String ticketId;
    
    @Indexed
    private String eventId;
    
    @Indexed
    private String userId;
    
    private String verificationMethod; // "QR"
    private String verificationStatus; // "VERIFIED", "REJECTED"
    private String blockchainStatus; // "NOT_STARTED", "PENDING", "CONFIRMED", "FAILED"
    
    private String credentialId;
    
    @Indexed
    private Instant checkedInAt;
    private String scannerId;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getVerificationMethod() { return verificationMethod; }
    public void setVerificationMethod(String verificationMethod) { this.verificationMethod = verificationMethod; }
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
    public String getBlockchainStatus() { return blockchainStatus; }
    public void setBlockchainStatus(String blockchainStatus) { this.blockchainStatus = blockchainStatus; }
    public String getCredentialId() { return credentialId; }
    public void setCredentialId(String credentialId) { this.credentialId = credentialId; }
    public Instant getCheckedInAt() { return checkedInAt; }
    public void setCheckedInAt(Instant checkedInAt) { this.checkedInAt = checkedInAt; }
    public String getScannerId() { return scannerId; }
    public void setScannerId(String scannerId) { this.scannerId = scannerId; }
}
