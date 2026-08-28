package com.eventone.credentialservice.outbox;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CredentialOutboxPublisher {

    private final OutboxRepository repository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public CredentialOutboxPublisher(OutboxRepository repository, KafkaTemplate<String, Object> kafkaTemplate) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(fixedDelay = 2000)
    public void publishPendingEvents() {
        List<OutboxEvent> pending = repository.findByStatusOrderByCreatedAtAsc("PENDING");
        for (OutboxEvent event : pending) {
            try {
                // Topic: eventone.credentials.requests
                kafkaTemplate.send("eventone.credentials.requests", event.getAggregateId(), event.getPayload()).get();
                event.setStatus("PUBLISHED");
                repository.save(event);
            } catch (Exception e) {
                // Will retry next poll
            }
        }
    }
}
