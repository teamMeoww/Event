package com.eventone.eventservice.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class EventRequest {
    @NotBlank
    private String title;
    
    @NotBlank
    private String description;
    
    @NotBlank
    private String category;
    
    @NotBlank
    private String location;

    @NotNull
    @Future
    private Instant startAt;

    @NotNull
    @Future
    private Instant endAt;

    @Min(1)
    private int capacity;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Instant getStartAt() { return startAt; }
    public void setStartAt(Instant startAt) { this.startAt = startAt; }
    public Instant getEndAt() { return endAt; }
    public void setEndAt(Instant endAt) { this.endAt = endAt; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
}
