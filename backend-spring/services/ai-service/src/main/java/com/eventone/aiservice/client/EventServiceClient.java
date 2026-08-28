package com.eventone.aiservice.client;

import com.eventone.aiservice.dto.EventDto;
import com.eventone.aiservice.dto.EventSearchIntent;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EventServiceClient {

    // Mock DB for MVP testing
    private List<EventDto> mockDb = List.of(
        new EventDto("EVT_1", "AI Hackathon", "AI", 300, "PUBLISHED", "2026-10-10T10:00:00Z", "2026-10-10T12:00:00Z"),
        new EventDto("EVT_2", "Web3 Summit", "WEB3", 900, "PUBLISHED", "2026-10-10T11:00:00Z", "2026-10-10T13:00:00Z"),
        new EventDto("EVT_3", "AI Workshop", "AI", 0, "CANCELLED", "2026-10-11T10:00:00Z", "2026-10-11T12:00:00Z")
    );

    public List<EventDto> searchEvents(EventSearchIntent intent) {
        return mockDb.stream()
            .filter(e -> "PUBLISHED".equals(e.getStatus())) // HARD FILTER: Never cancelled
            .filter(e -> intent.getMaxPrice() == null || e.getPrice() <= intent.getMaxPrice()) // HARD FILTER: Price
            .filter(e -> intent.getCategories() == null || intent.getCategories().isEmpty() || intent.getCategories().contains(e.getCategory()))
            .collect(Collectors.toList());
    }
    
    public List<EventDto> getEventsByIds(List<String> ids) {
        return mockDb.stream()
            .filter(e -> ids.contains(e.getId()))
            .filter(e -> "PUBLISHED".equals(e.getStatus()))
            .collect(Collectors.toList());
    }
}
