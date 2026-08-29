package com.eventone.checkinservice.outbox;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CheckinOutboxPublisher {

    private final OutboxRepository repository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public CheckinOutboxPublisher(OutboxRepository repository, KafkaTemplate<String, Object> kafkaTemplate) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(fixedDelay = 2000)
    public void publishPendingEvents() {
        List<OutboxEvent> pending = repository.findByStatusOrderByCreatedAtAsc("PENDING");
        for (OutboxEvent event : pending) {
            try {
                // Topic: eventone.checkins.events
                kafkaTemplate.send("eventone.checkins.events", event.getAggregateId(), event.getPayload()).get();
                event.setStatus("PUBLISHED");
                repository.save(event);
            } catch (Exception e) {
                // Will retry on next poll
            }
        }
    }
}
