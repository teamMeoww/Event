package com.eventone.aiservice.dto;
public class EventDto {
    private String id;
    private String name;
    private String category;
    private int price;
    private String status;
    private String startTime;
    private String endTime;
    
    public EventDto(String id, String name, String category, int price, String status, String startTime, String endTime) {
        this.id = id; this.name = name; this.category = category; this.price = price; this.status = status; this.startTime = startTime; this.endTime = endTime;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public int getPrice() { return price; }
    public String getStatus() { return status; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
}
