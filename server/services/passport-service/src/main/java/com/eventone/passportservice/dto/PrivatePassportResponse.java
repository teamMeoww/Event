package com.eventone.passportservice.dto;
import java.util.Map;

public class PrivatePassportResponse extends PublicPassportResponse {
    private Map<String, Integer> reputationBreakdown;

    public Map<String, Integer> getReputationBreakdown() { return reputationBreakdown; }
    public void setReputationBreakdown(Map<String, Integer> reputationBreakdown) { this.reputationBreakdown = reputationBreakdown; }
}
