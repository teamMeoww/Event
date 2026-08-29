package com.eventone.eventservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "events")
public class Event {
    @Id
    private String id;
    
    @Indexed
    private String organizerId;
    private String title;
    private String description;
    
    @Indexed
    private String category;
    
    @Indexed
    private List<String> tags;
    
    @Indexed
    private String location; // location.city would be nested if this was an object, but string for MVP
    
    @Indexed
    private Instant startAt;
    private Instant endAt;
    private int capacity;
    private int registeredCount;
    
    @Indexed
    private EventStatus status;
    private boolean blockchainEnabled;
    private String blockchainEventId;
    private String contractAddress;
    private String metadataURI;
    private Instant createdAt;
    private Instant updatedAt;

    // Getters and setters omitted for brevity in script, but should be generated in production IDE
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOrganizerId() { return organizerId; }
    public void setOrganizerId(String organizerId) { this.organizerId = organizerId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Instant getStartAt() { return startAt; }
    public void setStartAt(Instant startAt) { this.startAt = startAt; }
    public Instant getEndAt() { return endAt; }
    public void setEndAt(Instant endAt) { this.endAt = endAt; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public int getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(int registeredCount) { this.registeredCount = registeredCount; }
    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }
    public boolean isBlockchainEnabled() { return blockchainEnabled; }
    public void setBlockchainEnabled(boolean blockchainEnabled) { this.blockchainEnabled = blockchainEnabled; }
    public String getBlockchainEventId() { return blockchainEventId; }
    public void setBlockchainEventId(String blockchainEventId) { this.blockchainEventId = blockchainEventId; }
    public String getContractAddress() { return contractAddress; }
    public void setContractAddress(String contractAddress) { this.contractAddress = contractAddress; }
    public String getMetadataURI() { return metadataURI; }
    public void setMetadataURI(String metadataURI) { this.metadataURI = metadataURI; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
