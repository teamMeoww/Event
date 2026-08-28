package com.eventone.aiservice.service;

import com.eventone.aiservice.client.EventServiceClient;
import com.eventone.aiservice.client.GenericAiClient;
import com.eventone.aiservice.dto.EventDto;
import com.eventone.aiservice.dto.ItineraryResult;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class ItineraryEngine {

    private final EventServiceClient eventServiceClient;
    private final GenericAiClient aiClient;
    private final ObjectMapper objectMapper;

    public ItineraryEngine(EventServiceClient eventServiceClient, GenericAiClient aiClient, ObjectMapper objectMapper) {
        this.eventServiceClient = eventServiceClient;
        this.aiClient = aiClient;
        this.objectMapper = objectMapper;
    }

    public ItineraryResult generateItinerary(List<String> eventIds) {
        List<EventDto> actualEvents = eventServiceClient.getEventsByIds(eventIds);
        
        ItineraryResult result = new ItineraryResult();
        
        try {
            String systemPrompt = "You are an Event Itinerary Planner. " +
                    "Given a JSON list of EventOne events, generate an optimal itinerary. " +
                    "Output ONLY valid JSON matching this structure: " +
                    "{\"itinerary\": [{\"eventId\": \"string\", \"start\": \"string\", \"end\": \"string\", \"reason\": \"string\"}], \"conflicts\": [\"string\"]} " +
                    "Detect any time conflicts. Do NOT invent events. Do NOT output markdown.";
            
            String userPrompt = "Events: " + objectMapper.writeValueAsString(actualEvents);
            String aiResponse = aiClient.generateCompletion(systemPrompt, userPrompt);
            aiResponse = aiResponse.replaceAll("```json", "").replaceAll("```", "").trim();
            
            return objectMapper.readValue(aiResponse, ItineraryResult.class);
        } catch (Exception e) {
            // FALLBACK TO DETERMINISTIC ENGINE
            return fallbackGenerate(actualEvents);
        }
    }
    
    private ItineraryResult fallbackGenerate(List<EventDto> actualEvents) {
        ItineraryResult result = new ItineraryResult();
        List<ItineraryResult.ItineraryItem> items = new ArrayList<>();
        List<String> conflicts = new ArrayList<>();
        
        actualEvents.sort((a, b) -> Instant.parse(a.getStartTime()).compareTo(Instant.parse(b.getStartTime())));
        
        Instant previousEnd = null;
        for (EventDto e : actualEvents) {
            Instant currentStart = Instant.parse(e.getStartTime());
            if (previousEnd != null && currentStart.isBefore(previousEnd)) {
                conflicts.add("Conflict detected with event " + e.getId());
            }
            
            ItineraryResult.ItineraryItem item = new ItineraryResult.ItineraryItem();
            item.setEventId(e.getId());
            item.setStart(e.getStartTime());
            item.setEnd(e.getEndTime());
            item.setReason("Scheduled sequentially.");
            items.add(item);
            
            previousEnd = Instant.parse(e.getEndTime());
        }
        
        result.setItinerary(items);
        result.setConflicts(conflicts);
        return result;
    }
}
