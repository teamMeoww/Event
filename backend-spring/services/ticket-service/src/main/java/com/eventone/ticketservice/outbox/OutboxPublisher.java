package com.eventone.ticketservice.outbox;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.util.List;

@Component
public class OutboxPublisher {

    private final OutboxEventRepository repository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public OutboxPublisher(OutboxEventRepository repository, KafkaTemplate<String, Object> kafkaTemplate) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(fixedDelay = 5000)
    public void publishPendingEvents() {
        List<OutboxEvent> pendingEvents = repository.findByStatus("PENDING");
        for (OutboxEvent event : pendingEvents) {
            try {
                // Topic mapping based on aggregate/eventType
                String topic = "eventone.ticket.commands";
                
                // Use aggregateId as key (ticketId)
                kafkaTemplate.send(topic, event.getAggregateId(), event).get(); // Synchronous send for outbox guarantee
                
                event.setStatus("PUBLISHED");
                event.setPublishedAt(Instant.now());
            } catch (Exception e) {
                event.setAttempts(event.getAttempts() + 1);
                event.setLastError(e.getMessage());
                if (event.getAttempts() > 5) {
                    event.setStatus("FAILED");
                }
            }
            repository.save(event);
        }
    }
}
