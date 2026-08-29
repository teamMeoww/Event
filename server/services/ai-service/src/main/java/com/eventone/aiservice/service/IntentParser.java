package com.eventone.aiservice.service;

import com.eventone.aiservice.dto.EventSearchIntent;
import com.eventone.aiservice.client.GenericAiClient;
import org.springframework.stereotype.Service;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class IntentParser {

    private final GenericAiClient aiClient;
    private final ObjectMapper objectMapper;

    public IntentParser(GenericAiClient aiClient, ObjectMapper objectMapper) {
        this.aiClient = aiClient;
        this.objectMapper = objectMapper;
    }

    public EventSearchIntent parse(String query) {
        String systemPrompt = "You are an Event Intent Extraction assistant. " +
                "Extract parameters from the user's event search query. " +
                "Output ONLY valid JSON matching this structure: " +
                "{ \"categories\": [\"string\"], \"maxPrice\": 0.0, \"location\": \"string\" } " +
                "If a parameter is not specified, leave it null or empty array. " +
                "Do NOT include secrets, fake IDs, or markdown formatting.";

        try {
            String aiResponse = aiClient.generateCompletion(systemPrompt, query);
            
            // Clean markdown if present
            aiResponse = aiResponse.replaceAll("```json", "").replaceAll("```", "").trim();
            
            return objectMapper.readValue(aiResponse, EventSearchIntent.class);
        } catch (Exception e) {
            // FALLBACK TO DETERMINISTIC PARSER
            return fallbackParse(query);
        }
    }
    
    private EventSearchIntent fallbackParse(String query) {
        EventSearchIntent intent = new EventSearchIntent();
        String lowerQuery = query.toLowerCase();
        
        if (lowerQuery.contains("under 500") || lowerQuery.contains("under ₹500") || lowerQuery.contains("under 50")) {
            intent.setMaxPrice(500);
        }
        if (lowerQuery.contains("ai")) {
            intent.setCategories(List.of("AI"));
        }
        if (lowerQuery.contains("web3")) {
            intent.setCategories(List.of("Web3"));
        }
        
        return intent;
    }
}
