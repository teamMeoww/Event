package com.eventone.passportservice.service;

import com.eventone.passportservice.domain.Award;
import com.eventone.passportservice.domain.Contribution;
import com.eventone.passportservice.domain.Passport;
import com.eventone.passportservice.dto.OrganizerAwardRequest;
import com.eventone.passportservice.dto.OrganizerContributionRequest;
import com.eventone.passportservice.dto.PrivatePassportResponse;
import com.eventone.passportservice.dto.PublicPassportResponse;
import com.eventone.passportservice.repository.AchievementRepository;
import com.eventone.passportservice.repository.AwardRepository;
import com.eventone.passportservice.repository.ContributionRepository;
import com.eventone.passportservice.repository.PassportRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
public class PassportService {

    private final PassportRepository passportRepository;
    private final AchievementRepository achievementRepository;
    private final AwardRepository awardRepository;
    private final ContributionRepository contributionRepository;
    private final ReputationEngine reputationEngine;

    public PassportService(PassportRepository passportRepository,
                           AchievementRepository achievementRepository,
                           AwardRepository awardRepository,
                           ContributionRepository contributionRepository,
                           ReputationEngine reputationEngine) {
        this.passportRepository = passportRepository;
        this.achievementRepository = achievementRepository;
        this.awardRepository = awardRepository;
        this.contributionRepository = contributionRepository;
        this.reputationEngine = reputationEngine;
    }

    private Passport getOrCreatePassport(String userId) {
        return passportRepository.findByUserId(userId).orElseGet(() -> {
            Passport p = new Passport();
            p.setUserId(userId);
            p.setCreatedAt(Instant.now());
            p.setUpdatedAt(Instant.now());
            return passportRepository.save(p);
        });
    }

    public synchronized void processCheckinCompleted(String userId, String eventId, String eventName) {
        Passport passport = getOrCreatePassport(userId);
        passport.addVerifiedEvent(eventId, eventName != null ? eventName : "Unknown Event");
        recalculateAndSave(passport);
    }

    public synchronized void processCredentialConfirmed(String userId, String eventId, String credentialId, String status) {
        Passport passport = getOrCreatePassport(userId);
        passport.bindCredentialToEvent(credentialId, eventId, status);
        recalculateAndSave(passport);
    }

    public void addAward(String eventId, OrganizerAwardRequest req) {
        try {
            Award a = new Award();
            a.setUserId(req.getUserId());
            a.setEventId(eventId);
            a.setTitle(req.getTitle());
            a.setCreatedAt(Instant.now());
            awardRepository.save(a);
            
            Passport passport = getOrCreatePassport(req.getUserId());
            recalculateAndSave(passport);
        } catch (DuplicateKeyException e) {
            // idempotent
        }
    }

    public void addContribution(String eventId, OrganizerContributionRequest req) {
        try {
            Contribution c = new Contribution();
            c.setUserId(req.getUserId());
            c.setEventId(eventId);
            c.setType(req.getType());
            c.setVerified(true);
            c.setCreatedAt(Instant.now());
            contributionRepository.save(c);
            
            Passport passport = getOrCreatePassport(req.getUserId());
            recalculateAndSave(passport);
        } catch (DuplicateKeyException e) {
            // idempotent
        }
    }

    public synchronized void rebuildPassport(String userId) {
        Passport passport = getOrCreatePassport(userId);
        recalculateAndSave(passport);
    }

    private void recalculateAndSave(Passport passport) {
        reputationEngine.evaluateAchievements(passport);
        Map<String, Integer> breakdown = reputationEngine.calculateBreakdown(passport);
        passport.setReputationScore(breakdown.get("total"));
        passport.setUpdatedAt(Instant.now());
        passportRepository.save(passport);
    }
    
    public PrivatePassportResponse getPrivatePassport(String userId) {
        Passport passport = getOrCreatePassport(userId);
        
        PrivatePassportResponse res = new PrivatePassportResponse();
        res.setUserId(userId);
        res.setReputationScore(passport.getReputationScore());
        res.setVerifiedEvents(passport.getVerifiedEvents());
        res.setAchievements(achievementRepository.findByUserId(userId));
        res.setAwards(awardRepository.findByUserId(userId));
        res.setContributions(contributionRepository.findByUserId(userId));
        res.setReputationBreakdown(reputationEngine.calculateBreakdown(passport));
        
        return res;
    }
    
    public PublicPassportResponse getPublicPassport(String userId) {
        Passport passport = getOrCreatePassport(userId);
        
        PublicPassportResponse res = new PublicPassportResponse();
        res.setUserId(userId);
        res.setReputationScore(passport.getReputationScore());
        res.setVerifiedEvents(passport.getVerifiedEvents());
        res.setAchievements(achievementRepository.findByUserId(userId));
        res.setAwards(awardRepository.findByUserId(userId));
        res.setContributions(contributionRepository.findByUserId(userId));
        
        return res;
    }
}
