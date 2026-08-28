package com.eventone.aiservice.dto;
import java.util.List;
public class ItineraryResult {
    private List<ItineraryItem> itinerary;
    private List<String> conflicts;
    
    public static class ItineraryItem {
        private String eventId;
        private String start;
        private String end;
        private String reason;
        
        // Getters & Setters
        public String getEventId() { return eventId; }
        public void setEventId(String eventId) { this.eventId = eventId; }
        public String getStart() { return start; }
        public void setStart(String start) { this.start = start; }
        public String getEnd() { return end; }
        public void setEnd(String end) { this.end = end; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }

    public List<ItineraryItem> getItinerary() { return itinerary; }
    public void setItinerary(List<ItineraryItem> itinerary) { this.itinerary = itinerary; }
    public List<String> getConflicts() { return conflicts; }
    public void setConflicts(List<String> conflicts) { this.conflicts = conflicts; }
}
