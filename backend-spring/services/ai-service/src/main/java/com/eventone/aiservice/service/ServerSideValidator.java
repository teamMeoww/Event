package com.eventone.aiservice.service;

import com.eventone.aiservice.dto.EventDto;
import com.eventone.aiservice.dto.RecommendationResult;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ServerSideValidator {
    
    public RecommendationResult validateAndStrip(RecommendationResult llmResult, List<EventDto> candidates) {
        List<String> candidateIds = candidates.stream().map(EventDto::getId).collect(Collectors.toList());
        
        List<RecommendationResult.Recommendation> safeRecommendations = llmResult.getRecommendations().stream()
            .filter(rec -> candidateIds.contains(rec.getEventId())) // ANTI-HALLUCINATION FILTER
            .collect(Collectors.toList());
            
        llmResult.setRecommendations(safeRecommendations);
        
        if (safeRecommendations.isEmpty()) {
            llmResult.setMessage("No matching EventOne events were found.");
        }
        return llmResult;
    }
}
