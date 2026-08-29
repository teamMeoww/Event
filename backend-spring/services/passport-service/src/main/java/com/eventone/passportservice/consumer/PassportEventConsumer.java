package com.eventone.passportservice.consumer;

import com.eventone.passportservice.service.PassportService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;

@Component
public class PassportEventConsumer {

    private final PassportService passportService;
    private final StringRedisTemplate redisTemplate;

    public PassportEventConsumer(PassportService passportService, StringRedisTemplate redisTemplate) {
        this.passportService = passportService;
        this.redisTemplate = redisTemplate;
    }

    @KafkaListener(topics = "eventone.checkins.events", groupId = "passport-service-group")
    public void consumeCheckin(Map<String, Object> payload) {
        String checkInId = (String) payload.get("checkInId");
        if (checkInId == null || !isIdempotent("passport_checkin:" + checkInId)) return;

        String userId = (String) payload.get("userId");
        String eventId = (String) payload.get("eventId");
        String eventName = (String) payload.get("eventName"); // Could be passed or looked up
        
        if (userId != null && eventId != null) {
            passportService.processCheckinCompleted(userId, eventId, eventName);
        }
    }

    @KafkaListener(topics = "eventone.credentials.events", groupId = "passport-service-group")
    public void consumeCredential(Map<String, Object> payload) {
        String credentialId = (String) payload.get("credentialId");
        String status = (String) payload.get("status");
        
        if (credentialId == null || !isIdempotent("passport_cred:" + credentialId + ":" + status)) return;

        if ("CONFIRMED".equals(status) || "REVOKED_ON_CHAIN".equals(status)) {
            String userId = (String) payload.get("userId");
            String eventId = (String) payload.get("eventId");
            
            if (userId != null) {
                passportService.processCredentialConfirmed(userId, eventId, credentialId, status);
            }
        }
    }

    private boolean isIdempotent(String key) {
        Boolean set = redisTemplate.opsForValue().setIfAbsent("idemp:" + key, "processed", Duration.ofHours(24));
        return Boolean.TRUE.equals(set);
    }
}
