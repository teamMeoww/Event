package com.eventone.verificationservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "reconciliation_records")
public class ReconciliationRecord {
    @Id
    private String id;
    private String entityType; // TICKET, CREDENTIAL
    private String entityId;
    private String expectedState;
    private String actualState;
    private String status; // MATCHED, PENDING, MISMATCH, RESOLVED, MANUAL_REVIEW
    private Instant detectedAt;
    private Instant resolvedAt;
    private String details;
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }
    public String getExpectedState() { return expectedState; }
    public void setExpectedState(String expectedState) { this.expectedState = expectedState; }
    public String getActualState() { return actualState; }
    public void setActualState(String actualState) { this.actualState = actualState; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getDetectedAt() { return detectedAt; }
    public void setDetectedAt(Instant detectedAt) { this.detectedAt = detectedAt; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
