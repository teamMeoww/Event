package com.eventone.passportservice.service;

import com.eventone.passportservice.domain.Achievement;
import com.eventone.passportservice.domain.Award;
import com.eventone.passportservice.domain.Contribution;
import com.eventone.passportservice.domain.Passport;
import com.eventone.passportservice.repository.AchievementRepository;
import com.eventone.passportservice.repository.AwardRepository;
import com.eventone.passportservice.repository.ContributionRepository;
import com.eventone.passportservice.repository.PassportRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReputationEngine {
    
    private final AchievementRepository achievementRepository;
    private final AwardRepository awardRepository;
    private final ContributionRepository contributionRepository;

    public ReputationEngine(AchievementRepository achievementRepository,
                            AwardRepository awardRepository,
                            ContributionRepository contributionRepository) {
        this.achievementRepository = achievementRepository;
        this.awardRepository = awardRepository;
        this.contributionRepository = contributionRepository;
    }

    public Map<String, Integer> calculateBreakdown(Passport passport) {
        Map<String, Integer> breakdown = new HashMap<>();
        
        int attendancePoints = passport.getVerifiedEvents().size() * 10;
        int credentialPoints = passport.getCredentialIds().size() * 5;
        
        List<Contribution> contributions = contributionRepository.findByUserId(passport.getUserId());
        int contributionPoints = (int) contributions.stream().filter(Contribution::isVerified).count() * 25;
        
        List<Award> awards = awardRepository.findByUserId(passport.getUserId());
        int awardPoints = awards.size() * 50;
        
        breakdown.put("verifiedAttendance", attendancePoints);
        breakdown.put("credentials", credentialPoints);
        breakdown.put("contributions", contributionPoints);
        breakdown.put("awards", awardPoints);
        breakdown.put("total", attendancePoints + credentialPoints + contributionPoints + awardPoints);
        
        return breakdown;
    }

    public void evaluateAchievements(Passport passport) {
        String userId = passport.getUserId();
        int eventCount = passport.getVerifiedEvents().size();
        
        if (eventCount >= 1) {
            grantAchievement(userId, "FIRST_EVENT", "First Event", "Attended first verified event.");
        }
        if (eventCount >= 3) {
            grantAchievement(userId, "EVENT_VETERAN", "Event Veteran", "Attended 3 verified events.");
        }
        
        boolean hasWinnerAward = awardRepository.findByUserId(userId).stream()
            .anyMatch(a -> a.getTitle().toUpperCase().contains("WINNER"));
        
        if (hasWinnerAward) {
            grantAchievement(userId, "HACKATHON_WINNER", "Hackathon Winner", "Won an event award.");
        }
    }

    private void grantAchievement(String userId, String type, String title, String description) {
        try {
            Achievement a = new Achievement();
            a.setUserId(userId);
            a.setType(type);
            a.setTitle(title);
            a.setDescription(description);
            a.setEarnedAt(Instant.now());
            achievementRepository.save(a);
            System.out.println("Granted achievement " + type + " to " + userId);
        } catch (DuplicateKeyException e) {
            // Idempotent: already has this achievement
        }
    }
}
