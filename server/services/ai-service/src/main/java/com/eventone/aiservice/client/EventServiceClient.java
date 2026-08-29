package com.eventone.aiservice.client;

import com.eventone.aiservice.dto.EventDto;
import com.eventone.aiservice.dto.EventSearchIntent;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EventServiceClient {

    @org.springframework.beans.factory.annotation.Value("${eventone.services.event:http://localhost:8082}")
    private String eventServiceUrl;

    private final org.springframework.web.reactive.function.client.WebClient webClient;

    public EventServiceClient(org.springframework.web.reactive.function.client.WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    
    @SuppressWarnings("unchecked")
    private List<EventDto> fetchAllEvents() {
        try {
            java.util.Map<String, Object> response = webClient.get()
                    .uri(eventServiceUrl + "/api/v1/events?size=100") // MVP: Get first 100
                    .retrieve()
                    .bodyToMono(java.util.Map.class)
                    .block();
                    
            if (response != null && response.containsKey("data")) {
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) response.get("data");
                if (data.containsKey("content")) {
                    List<java.util.Map<String, Object>> content = (List<java.util.Map<String, Object>>) data.get("content");
                    return content.stream().map(this::mapToDto).collect(Collectors.toList());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }
    
    private EventDto mapToDto(java.util.Map<String, Object> map) {
        return new EventDto(
            (String) map.get("id"),
            (String) map.get("name"),
            (String) map.get("category"),
            map.get("price") != null ? (int) Double.parseDouble(map.get("price").toString()) : 0,
            (String) map.get("status"),
            (String) map.get("startDate"),
            (String) map.get("endDate")
        );
    }

    public List<EventDto> searchEvents(EventSearchIntent intent) {
        return fetchAllEvents().stream()
            .filter(e -> "PUBLISHED".equals(e.getStatus())) // HARD FILTER: Never cancelled
            .filter(e -> intent.getMaxPrice() == null || e.getPrice() <= intent.getMaxPrice()) // HARD FILTER: Price
            .filter(e -> intent.getCategories() == null || intent.getCategories().isEmpty() || intent.getCategories().contains(e.getCategory()))
            .collect(Collectors.toList());
    }
    
    public List<EventDto> getEventsByIds(List<String> ids) {
        return fetchAllEvents().stream()
            .filter(e -> ids.contains(e.getId()))
            .filter(e -> "PUBLISHED".equals(e.getStatus()))
            .collect(Collectors.toList());
    }
}
