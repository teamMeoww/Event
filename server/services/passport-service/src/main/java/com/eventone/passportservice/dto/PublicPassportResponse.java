package com.eventone.passportservice.dto;
import com.eventone.passportservice.domain.Passport;
import com.eventone.passportservice.domain.Achievement;
import com.eventone.passportservice.domain.Award;
import com.eventone.passportservice.domain.Contribution;
import java.util.List;

public class PublicPassportResponse {
    private String userId;
    private int reputationScore;
    private List<Passport.VerifiedEvent> verifiedEvents;
    private List<Achievement> achievements;
    private List<Award> awards;
    private List<Contribution> contributions;
    
    // Getters and setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public int getReputationScore() { return reputationScore; }
    public void setReputationScore(int reputationScore) { this.reputationScore = reputationScore; }
    public List<Passport.VerifiedEvent> getVerifiedEvents() { return verifiedEvents; }
    public void setVerifiedEvents(List<Passport.VerifiedEvent> verifiedEvents) { this.verifiedEvents = verifiedEvents; }
    public List<Achievement> getAchievements() { return achievements; }
    public void setAchievements(List<Achievement> achievements) { this.achievements = achievements; }
    public List<Award> getAwards() { return awards; }
    public void setAwards(List<Award> awards) { this.awards = awards; }
    public List<Contribution> getContributions() { return contributions; }
    public void setContributions(List<Contribution> contributions) { this.contributions = contributions; }
}
