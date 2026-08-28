package com.eventone.aiservice;

import com.eventone.aiservice.dto.AiItineraryRequest;
import com.eventone.aiservice.dto.AiRecommendRequest;
import com.eventone.aiservice.dto.ItineraryResult;
import com.eventone.aiservice.dto.RecommendationResult;
import com.eventone.aiservice.service.ItineraryEngine;
import com.eventone.aiservice.service.RecommendationEngine;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class AiServiceIntegrationTest {

    @Autowired
    private RecommendationEngine recommendationEngine;

    @Autowired
    private ItineraryEngine itineraryEngine;

    @Test
    void testPriceFilterRespected() {
        AiRecommendRequest req = new AiRecommendRequest();
        req.setQuery("I want an AI event under 500");
        
        RecommendationResult res = recommendationEngine.recommend(req.getQuery());
        
        // Mock DB has EVT_1 (300) and EVT_2 (900)
        assertTrue(res.getRecommendations().stream().anyMatch(r -> r.getEventId().equals("EVT_1")));
        assertFalse(res.getRecommendations().stream().anyMatch(r -> r.getEventId().equals("EVT_2")));
    }

    @Test
    void testCancelledEventExcluded() {
        AiRecommendRequest req = new AiRecommendRequest();
        req.setQuery("Find all AI events");
        
        RecommendationResult res = recommendationEngine.recommend(req.getQuery());
        
        // EVT_3 is CANCELLED in the mock db
        assertFalse(res.getRecommendations().stream().anyMatch(r -> r.getEventId().equals("EVT_3")));
    }

    @Test
    void testAntiHallucinationValidatorStrikesFakeEvents() {
        // Query triggering the injection code path
        AiRecommendRequest req = new AiRecommendRequest();
        req.setQuery("Find AI fake events");
        
        RecommendationResult res = recommendationEngine.recommend(req.getQuery());
        
        // Ensure EVT_FAKE is NOT in the response
        assertFalse(res.getRecommendations().stream().anyMatch(r -> r.getEventId().equals("EVT_FAKE")));
    }

    @Test
    void testItineraryConflictDetection() {
        AiItineraryRequest req = new AiItineraryRequest();
        req.setEventIds(List.of("EVT_1", "EVT_2"));
        // EVT_1: 10:00 to 12:00
        // EVT_2: 11:00 to 13:00
        
        ItineraryResult res = itineraryEngine.generateItinerary(req.getEventIds());
        
        assertEquals(2, res.getItinerary().size());
        assertEquals(1, res.getConflicts().size()); // Expect conflict
        assertTrue(res.getConflicts().get(0).contains("EVT_2"));
    }
}
