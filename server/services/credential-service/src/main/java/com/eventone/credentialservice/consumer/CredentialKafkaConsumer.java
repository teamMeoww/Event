package com.eventone.credentialservice.consumer;

import com.eventone.credentialservice.service.CredentialService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.Objects;

@Component
public class CredentialKafkaConsumer {

    private final CredentialService credentialService;
    private final StringRedisTemplate redisTemplate;

    public CredentialKafkaConsumer(CredentialService credentialService, StringRedisTemplate redisTemplate) {
        this.credentialService = credentialService;
        this.redisTemplate = redisTemplate;
    }

    @KafkaListener(topics = "eventone.checkins.events", groupId = "credential-service-group")
    public void consumeCheckin(Map<String, Object> payload) {
        String checkInId = (String) payload.get("checkInId");
        if (checkInId == null || !isIdempotent("checkin:" + checkInId)) return;
        
        credentialService.processCheckinCompleted(payload);
    }

    @KafkaListener(topics = "eventone.credentials.events", groupId = "credential-service-group")
    public void consumeBlockchainEvents(Map<String, Object> payload) {
        String eventType = (String) payload.get("eventType");
        String eventId = (String) payload.get("eventId");
        String txHash = (String) payload.get("transactionHash");
        String uniqueId = eventId != null ? eventId : (txHash != null ? txHash : String.valueOf(payload.hashCode()));

        if (!isIdempotent("blockchain_event:" + uniqueId + ":" + eventType)) return;

        if ("CREDENTIAL_BLOCKCHAIN_CONFIRMED".equals(eventType)) {
            credentialService.processBlockchainConfirmed(payload);
        } else if ("CREDENTIAL_BLOCKCHAIN_PENDING".equals(eventType)) {
            credentialService.processBlockchainPending(payload);
        } else if ("CREDENTIAL_BLOCKCHAIN_FAILED".equals(eventType)) {
            credentialService.processBlockchainFailed(payload);
        } else if ("CREDENTIAL_BLOCKCHAIN_REVOKED".equals(eventType)) {
            credentialService.processBlockchainRevoked(payload);
        }
    }

    private boolean isIdempotent(String key) {
        Boolean set = redisTemplate.opsForValue().setIfAbsent("idemp:" + key, "processed", Objects.requireNonNull(Duration.ofHours(24), "ttl"));
        return Boolean.TRUE.equals(set);
    }
}
