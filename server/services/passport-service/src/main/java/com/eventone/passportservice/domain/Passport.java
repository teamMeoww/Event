package com.eventone.passportservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Document(collection = "passports")
public class Passport {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String userId;
    
    private int reputationScore;
    
    private List<VerifiedEvent> verifiedEvents = new ArrayList<>();
    private List<String> credentialIds = new ArrayList<>();
    
    private Instant createdAt;
    private Instant updatedAt;
    
    public static class VerifiedEvent {
        private String eventId;
        private String eventName;
        private Instant eventDate;
        private String attendanceStatus; // VERIFIED
        private String credentialId;
        private String credentialStatus;
        
        // Getters / Setters
        public String getEventId() { return eventId; }
        public void setEventId(String eventId) { this.eventId = eventId; }
        public String getEventName() { return eventName; }
        public void setEventName(String eventName) { this.eventName = eventName; }
        public Instant getEventDate() { return eventDate; }
        public void setEventDate(Instant eventDate) { this.eventDate = eventDate; }
        public String getAttendanceStatus() { return attendanceStatus; }
        public void setAttendanceStatus(String attendanceStatus) { this.attendanceStatus = attendanceStatus; }
        public String getCredentialId() { return credentialId; }
        public void setCredentialId(String credentialId) { this.credentialId = credentialId; }
        public String getCredentialStatus() { return credentialStatus; }
        public void setCredentialStatus(String credentialStatus) { this.credentialStatus = credentialStatus; }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public int getReputationScore() { return reputationScore; }
    public void setReputationScore(int reputationScore) { this.reputationScore = reputationScore; }
    public List<VerifiedEvent> getVerifiedEvents() { return verifiedEvents; }
    public void setVerifiedEvents(List<VerifiedEvent> verifiedEvents) { this.verifiedEvents = verifiedEvents; }
    public List<String> getCredentialIds() { return credentialIds; }
    public void setCredentialIds(List<String> credentialIds) { this.credentialIds = credentialIds; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public void addVerifiedEvent(String eventId, String eventName) {
        if (verifiedEvents.stream().noneMatch(e -> e.getEventId().equals(eventId))) {
            VerifiedEvent ve = new VerifiedEvent();
            ve.setEventId(eventId);
            ve.setEventName(eventName);
            ve.setAttendanceStatus("VERIFIED");
            verifiedEvents.add(ve);
        }
    }
    
    public void bindCredentialToEvent(String credentialId, String eventId, String status) {
        if (!credentialIds.contains(credentialId)) {
            credentialIds.add(credentialId);
        }
        verifiedEvents.stream()
            .filter(e -> e.getEventId().equals(eventId))
            .findFirst()
            .ifPresent(e -> {
                e.setCredentialId(credentialId);
                e.setCredentialStatus(status);
            });
    }
}
