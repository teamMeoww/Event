package com.eventone.aiservice.dto;
import java.util.List;
public class AiItineraryRequest {
    private String query;
    private List<String> eventIds;
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    public List<String> getEventIds() { return eventIds; }
    public void setEventIds(List<String> eventIds) { this.eventIds = eventIds; }
}
