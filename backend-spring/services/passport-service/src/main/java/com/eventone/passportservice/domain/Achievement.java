package com.eventone.passportservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "achievements")
@CompoundIndex(name = "user_type_idx", def = "{'userId': 1, 'type': 1}", unique = true)
public class Achievement {
    @Id
    private String id;
    private String userId;
    private String type; // e.g., FIRST_EVENT, EVENT_VETERAN, HACKATHON_WINNER
    private String title;
    private String description;
    private Instant earnedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getEarnedAt() { return earnedAt; }
    public void setEarnedAt(Instant earnedAt) { this.earnedAt = earnedAt; }
}
