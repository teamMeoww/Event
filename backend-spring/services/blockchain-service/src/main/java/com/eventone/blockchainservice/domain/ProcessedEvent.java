package com.eventone.blockchainservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "processed_events")
@CompoundIndex(def = "{'eventId': 1, 'consumer': 1}", unique = true)
public class ProcessedEvent {
    @Id
    private String id;
    private String eventId;
    private String consumer;
    private Instant processedAt;

    public ProcessedEvent(String eventId, String consumer, Instant processedAt) {
        this.eventId = eventId;
        this.consumer = consumer;
        this.processedAt = processedAt;
    }
    
    // Getters
    public String getEventId() { return eventId; }
    public String getConsumer() { return consumer; }
    public Instant getProcessedAt() { return processedAt; }
}
