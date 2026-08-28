package com.eventone.credentialservice.consumer;

import com.eventone.credentialservice.service.CredentialService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class CredentialKafkaConsumer {

    private final CredentialService credentialService;

    public CredentialKafkaConsumer(CredentialService credentialService) {
        this.credentialService = credentialService;
    }

    @KafkaListener(topics = "eventone.checkins.events", groupId = "credential-service-group")
    public void consumeCheckin(Map<String, Object> payload) {
        credentialService.processCheckinCompleted(payload);
    }

    @KafkaListener(topics = "eventone.credentials.events", groupId = "credential-service-group")
    public void consumeBlockchainEvents(Map<String, Object> payload) {
        if ("CONFIRMED".equals(payload.get("status"))) {
            credentialService.processBlockchainConfirmed(payload);
        }
    }
}
