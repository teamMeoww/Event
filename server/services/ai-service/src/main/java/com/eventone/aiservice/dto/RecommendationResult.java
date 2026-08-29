package com.eventone.aiservice.dto;
import java.util.List;
public class RecommendationResult {
    private List<Recommendation> recommendations;
    private String message;
    
    public static class Recommendation {
        private String eventId;
        private double score;
        private String reason;
        
        public String getEventId() { return eventId; }
        public void setEventId(String eventId) { this.eventId = eventId; }
        public double getScore() { return score; }
        public void setScore(double score) { this.score = score; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }

    public List<Recommendation> getRecommendations() { return recommendations; }
    public void setRecommendations(List<Recommendation> recommendations) { this.recommendations = recommendations; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
