package com.eventone.verificationservice.dto;
public class OnChainState {
    private String owner;
    private String eventId;
    private boolean revoked;
    private boolean exists;
    
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public boolean isRevoked() { return revoked; }
    public void setRevoked(boolean revoked) { this.revoked = revoked; }
    public boolean isExists() { return exists; }
    public void setExists(boolean exists) { this.exists = exists; }
}
