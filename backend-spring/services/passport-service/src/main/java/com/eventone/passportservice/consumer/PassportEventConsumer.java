package com.eventone.passportservice.consumer;

import com.eventone.passportservice.service.PassportService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class PassportEventConsumer {

    private final PassportService passportService;

    public PassportEventConsumer(PassportService passportService) {
        this.passportService = passportService;
    }

    @KafkaListener(topics = "eventone.checkins.events", groupId = "passport-service-group")
    public void consumeCheckin(Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        String eventId = (String) payload.get("eventId");
        String eventName = (String) payload.get("eventName"); // Could be passed or looked up
        
        if (userId != null && eventId != null) {
            passportService.processCheckinCompleted(userId, eventId, eventName);
        }
    }

    @KafkaListener(topics = "eventone.credentials.events", groupId = "passport-service-group")
    public void consumeCredential(Map<String, Object> payload) {
        String status = (String) payload.get("status");
        if ("CONFIRMED".equals(status) || "REVOKED_ON_CHAIN".equals(status)) {
            String userId = (String) payload.get("userId");
            String eventId = (String) payload.get("eventId");
            String credentialId = (String) payload.get("credentialId");
            
            if (userId != null && credentialId != null) {
                passportService.processCredentialConfirmed(userId, eventId, credentialId, status);
            }
        }
    }
}
