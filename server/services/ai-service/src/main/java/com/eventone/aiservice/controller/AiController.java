package com.eventone.aiservice.controller;

import com.eventone.aiservice.dto.AiItineraryRequest;
import com.eventone.aiservice.dto.AiRecommendRequest;
import com.eventone.aiservice.dto.ItineraryResult;
import com.eventone.aiservice.dto.RecommendationResult;
import com.eventone.aiservice.service.ItineraryEngine;
import com.eventone.aiservice.service.RecommendationEngine;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final RecommendationEngine recommendationEngine;
    private final ItineraryEngine itineraryEngine;

    public AiController(RecommendationEngine recommendationEngine, ItineraryEngine itineraryEngine) {
        this.recommendationEngine = recommendationEngine;
        this.itineraryEngine = itineraryEngine;
    }

    @PostMapping("/recommend")
    @Cacheable(value = "ai-recommend", key = "#request.query")
    public ResponseEntity<RecommendationResult> recommend(@RequestBody AiRecommendRequest request) {
        // Rate limiting would be intercepted at a filter level
        return ResponseEntity.ok(recommendationEngine.recommend(request.getQuery()));
    }

    @PostMapping("/itinerary")
    public ResponseEntity<ItineraryResult> itinerary(@RequestBody AiItineraryRequest request) {
        return ResponseEntity.ok(itineraryEngine.generateItinerary(request.getEventIds()));
    }
}
