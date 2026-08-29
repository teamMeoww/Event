package com.eventone.ticketservice.outbox;

import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Component
@Endpoint(id = "outbox")
public class OutboxActuatorEndpoint {

    private final OutboxEventRepository repository;

    public OutboxActuatorEndpoint(OutboxEventRepository repository) {
        this.repository = repository;
    }

    @ReadOperation
    public Map<String, Object> outboxMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        long pending = repository.countByStatus("PENDING");
        long failed = repository.countByStatus("FAILED");
        long published = repository.countByStatus("PUBLISHED");
        
        metrics.put("pending_events", pending);
        metrics.put("failed_events", failed);
        metrics.put("published_events", published);
        
        OutboxEvent oldest = repository.findFirstByStatusOrderByCreatedAtAsc("PENDING");
        if (oldest != null) {
            metrics.put("oldest_pending_age_seconds", Instant.now().getEpochSecond() - oldest.getCreatedAt().getEpochSecond());
            metrics.put("oldest_pending_id", oldest.getId());
        }
        
        return metrics;
    }
}
