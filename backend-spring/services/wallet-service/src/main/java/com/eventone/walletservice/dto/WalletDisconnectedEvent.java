package com.eventone.walletservice.dto;
import java.time.Instant;
public class WalletDisconnectedEvent {
    private String eventType = "WALLET_DISCONNECTED";
    private String userId;
    private Instant timestamp;
    
    // Getters and Setters
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
