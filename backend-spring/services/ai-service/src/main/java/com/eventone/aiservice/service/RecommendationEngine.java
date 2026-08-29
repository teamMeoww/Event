package com.eventone.aiservice.service;

import com.eventone.aiservice.client.EventServiceClient;
import com.eventone.aiservice.dto.EventDto;
import com.eventone.aiservice.dto.EventSearchIntent;
import com.eventone.aiservice.dto.RecommendationResult;
import com.eventone.aiservice.client.GenericAiClient;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationEngine {

    private final IntentParser intentParser;
    private final EventServiceClient eventServiceClient;
    private final ServerSideValidator validator;
    private final GenericAiClient aiClient;
    private final ObjectMapper objectMapper;

    public RecommendationEngine(IntentParser intentParser, EventServiceClient eventServiceClient, ServerSideValidator validator, GenericAiClient aiClient, ObjectMapper objectMapper) {
        this.intentParser = intentParser;
        this.eventServiceClient = eventServiceClient;
        this.validator = validator;
        this.aiClient = aiClient;
        this.objectMapper = objectMapper;
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

        // 3. AI Semantic Ranking
        RecommendationResult rawResult = new RecommendationResult();
        
        try {
            String systemPrompt = "You are an Event Recommendation assistant. " +
                    "Given the user's query and a JSON list of available EventOne events, " +
                    "rank the events by relevance. Output ONLY valid JSON matching this structure: " +
                    "[{\"eventId\": \"string\", \"score\": 0.95, \"reason\": \"string\"}] " +
                    "Do NOT invent events that are not in the provided list. " +
                    "Do NOT include secrets. Do NOT hallucinate. Do NOT output markdown.";
                    
            String userPrompt = "Query: " + query + "\nEvents: " + objectMapper.writeValueAsString(candidates);

            String aiResponse = aiClient.generateCompletion(systemPrompt, userPrompt);
            aiResponse = aiResponse.replaceAll("```json", "").replaceAll("```", "").trim();
            
            List<RecommendationResult.Recommendation> recs = objectMapper.readValue(
                aiResponse, 
                new TypeReference<List<RecommendationResult.Recommendation>>(){}
            );
            rawResult.setRecommendations(recs);
        } catch (Exception e) {
            // FALLBACK TO DETERMINISTIC RANKING (Mocked style but without AI hallucination)
            List<RecommendationResult.Recommendation> recs = new ArrayList<>();
            for (EventDto candidate : candidates) {
                RecommendationResult.Recommendation r = new RecommendationResult.Recommendation();
                r.setEventId(candidate.getId());
                r.setScore(0.80);
                r.setReason("Fallback matching: Matches your preferences for " + candidate.getCategory());
                recs.add(r);
            }
            rawResult.setRecommendations(recs);
        }

        // 4. Server-Side Validation (Grounding)
        return validator.validateAndStrip(rawResult, candidates);
    }
}
