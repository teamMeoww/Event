package com.eventone.aiservice.service;

import com.eventone.aiservice.dto.EventSearchIntent;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IntentParser {
    public EventSearchIntent parse(String query) {
        // Normally calls LLM via Spring AI.
        // Mocking structured extraction based on keywords
        EventSearchIntent intent = new EventSearchIntent();
        String lowerQuery = query.toLowerCase();
        
        if (lowerQuery.contains("under 500") || lowerQuery.contains("under ₹500")) {
            intent.setMaxPrice(500);
        }
        if (lowerQuery.contains("ai")) {
            intent.setCategories(List.of("AI"));
        }
        
        return intent;
    }
}
