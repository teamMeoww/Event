package com.eventone.aiservice.service;

import com.eventone.aiservice.client.EventServiceClient;
import com.eventone.aiservice.dto.EventDto;
import com.eventone.aiservice.dto.EventSearchIntent;
import com.eventone.aiservice.dto.RecommendationResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationEngine {

    private final IntentParser intentParser;
    private final EventServiceClient eventServiceClient;
    private final ServerSideValidator validator;

    public RecommendationEngine(IntentParser intentParser, EventServiceClient eventServiceClient, ServerSideValidator validator) {
        this.intentParser = intentParser;
        this.eventServiceClient = eventServiceClient;
        this.validator = validator;
    }

    public RecommendationResult recommend(String query) {
        // 1. Understand Intent
        EventSearchIntent intent = intentParser.parse(query);
        
        // 2. Deterministic Candidate Search
        List<EventDto> candidates = eventServiceClient.searchEvents(intent);
        
        if (candidates.isEmpty()) {
            RecommendationResult empty = new RecommendationResult();
            empty.setRecommendations(new ArrayList<>());
            empty.setMessage("No matching EventOne events were found.");
            return empty;
        }

        // 3. AI Semantic Ranking (Mocked here)
        RecommendationResult rawResult = new RecommendationResult();
        List<RecommendationResult.Recommendation> recs = new ArrayList<>();
        
        for (EventDto candidate : candidates) {
            RecommendationResult.Recommendation r = new RecommendationResult.Recommendation();
            r.setEventId(candidate.getId());
            r.setScore(0.95);
            r.setReason("Matches your preferences for " + candidate.getCategory() + " under ₹" + candidate.getPrice());
            recs.add(r);
        }
        
        // SIMULATE PROMPT INJECTION / HALLUCINATION 
        if (query.contains("fake")) {
            RecommendationResult.Recommendation fake = new RecommendationResult.Recommendation();
            fake.setEventId("EVT_FAKE");
            fake.setReason("I invented this for you!");
            recs.add(fake);
        }
        
        rawResult.setRecommendations(recs);

        // 4. Server-Side Validation
        return validator.validateAndStrip(rawResult, candidates);
    }
}
