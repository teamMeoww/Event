package com.eventone.aiservice.service;

import com.eventone.aiservice.client.EventServiceClient;
import com.eventone.aiservice.dto.EventDto;
import com.eventone.aiservice.dto.ItineraryResult;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class ItineraryEngine {

    private final EventServiceClient eventServiceClient;

    public ItineraryEngine(EventServiceClient eventServiceClient) {
        this.eventServiceClient = eventServiceClient;
    }

    public ItineraryResult generateItinerary(List<String> eventIds) {
        List<EventDto> actualEvents = eventServiceClient.getEventsByIds(eventIds);
        
        ItineraryResult result = new ItineraryResult();
        List<ItineraryResult.ItineraryItem> items = new ArrayList<>();
        List<String> conflicts = new ArrayList<>();
        
        // Sort explicitly by start time
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
            item.setReason("Scheduled.");
            items.add(item);
            
            previousEnd = Instant.parse(e.getEndTime());
        }
        
        result.setItinerary(items);
        result.setConflicts(conflicts);
        return result;
    }
}
