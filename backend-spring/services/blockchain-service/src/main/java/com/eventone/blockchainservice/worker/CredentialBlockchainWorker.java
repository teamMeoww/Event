package com.eventone.blockchainservice.worker;

import com.eventone.blockchainservice.service.BlockchainActionService;
import com.eventone.blockchainservice.domain.ProcessedEvent;
import com.eventone.blockchainservice.repository.ProcessedEventRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.time.Instant;
import java.util.Objects;

@Component
public class CredentialBlockchainWorker {

    private final BlockchainActionService actionService;
    private final ProcessedEventRepository processedEventRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public CredentialBlockchainWorker(BlockchainActionService actionService, 
                                      ProcessedEventRepository processedEventRepository,
                                      KafkaTemplate<String, Object> kafkaTemplate) {
        this.actionService = actionService;
        this.processedEventRepository = processedEventRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "eventone.credentials.requests", groupId = "blockchain-service-group")
    @Transactional
    @SuppressWarnings("unchecked")
    public void processCredentialRequest(Map<String, Object> payload) {
        String requestEventId = (String) payload.get("eventId");
        String eventType = (String) payload.getOrDefault("eventType", "CREDENTIAL_ISSUANCE_REQUESTED");
        String credentialId = (String) payload.get("aggregateId");
        if (credentialId == null && payload.get("payload") instanceof Map<?, ?> nestedPayload) {
            credentialId = (String) nestedPayload.get("credentialId");
        }
        
        if (requestEventId == null) {
            requestEventId = "CRED_REQ_" + credentialId + "_" + eventType;
        }

        if (processedEventRepository.findByEventIdAndConsumer(requestEventId, "CREDENTIAL_BLOCKCHAIN").isPresent()) {
            System.out.println("Duplicate credential request detected, ignoring: " + requestEventId);
            return;
        }

        System.out.println("Processing " + eventType + " for " + credentialId);

        Map<String, Object> nestedPayload = (Map<String, Object>) payload.get("payload");
        if (nestedPayload == null) {
            nestedPayload = payload;
        }

        if ("CREDENTIAL_ISSUANCE_REQUESTED".equals(eventType)) {
            String credentialEventId = (String) nestedPayload.getOrDefault("eventId", "UNKNOWN_EVENT");
            String walletAddress = (String) nestedPayload.get("walletAddress");
            String metadataURI = (String) nestedPayload.get("metadataURI");
            String type = (String) nestedPayload.get("type");

            var res = actionService.issueCredential(walletAddress, credentialEventId, type, metadataURI, credentialId);

            Map<String, Object> blockchainEvent = new HashMap<>();
            blockchainEvent.put("requestEventId", requestEventId);
            blockchainEvent.put("credentialId", credentialId);
            blockchainEvent.put("userId", nestedPayload.get("userId"));
            blockchainEvent.put("eventId", credentialEventId);
            blockchainEvent.put("tokenId", res.getTokenId());
            blockchainEvent.put("transactionHash", res.getTransactionHash());
            blockchainEvent.put("chainId", nestedPayload.get("chainId"));
            blockchainEvent.put("walletAddress", walletAddress);

            if ("CONFIRMED".equals(res.getStatus())) {
                blockchainEvent.put("eventType", "CREDENTIAL_BLOCKCHAIN_CONFIRMED");
                blockchainEvent.put("status", "CONFIRMED");
                kafkaTemplate.send("eventone.credentials.events", Objects.requireNonNull(credentialId, "credentialId"), blockchainEvent);
            } else if ("PENDING".equals(res.getStatus())) {
                blockchainEvent.put("eventType", "CREDENTIAL_BLOCKCHAIN_PENDING");
                blockchainEvent.put("status", "PENDING");
                kafkaTemplate.send("eventone.credentials.events", Objects.requireNonNull(credentialId, "credentialId"), blockchainEvent);
            } else {
                blockchainEvent.put("eventType", "CREDENTIAL_BLOCKCHAIN_FAILED");
                blockchainEvent.put("status", "FAILED");
                blockchainEvent.put("lastError", res.getStatus());
                kafkaTemplate.send("eventone.credentials.events", Objects.requireNonNull(credentialId, "credentialId"), blockchainEvent);
            }

            processedEventRepository.save(new ProcessedEvent(requestEventId, "CREDENTIAL_BLOCKCHAIN", Instant.now()));
        } else if ("CREDENTIAL_REVOCATION_REQUESTED".equals(eventType)) {
            String tokenId = String.valueOf(nestedPayload.get("tokenId"));

            var res = actionService.revokeCredential(tokenId, credentialId);

            Map<String, Object> blockchainEvent = new HashMap<>();
            blockchainEvent.put("credentialId", credentialId);
            blockchainEvent.put("userId", nestedPayload.get("userId"));
            blockchainEvent.put("requestEventId", requestEventId);
            blockchainEvent.put("eventId", nestedPayload.get("eventId"));
            blockchainEvent.put("tokenId", tokenId);
            blockchainEvent.put("transactionHash", res.getTransactionHash());
            blockchainEvent.put("chainId", nestedPayload.get("chainId"));

            if ("CONFIRMED".equals(res.getStatus())) {
                blockchainEvent.put("eventType", "CREDENTIAL_BLOCKCHAIN_REVOKED");
                blockchainEvent.put("status", "REVOKED_ON_CHAIN");
                kafkaTemplate.send("eventone.credentials.events", Objects.requireNonNull(credentialId, "credentialId"), blockchainEvent);
            } else if ("PENDING".equals(res.getStatus())) {
                blockchainEvent.put("eventType", "CREDENTIAL_BLOCKCHAIN_PENDING");
                blockchainEvent.put("status", "PENDING");
                kafkaTemplate.send("eventone.credentials.events", Objects.requireNonNull(credentialId, "credentialId"), blockchainEvent);
            } else {
                blockchainEvent.put("eventType", "CREDENTIAL_BLOCKCHAIN_FAILED");
                blockchainEvent.put("status", "FAILED");
                blockchainEvent.put("lastError", res.getStatus());
                kafkaTemplate.send("eventone.credentials.events", Objects.requireNonNull(credentialId, "credentialId"), blockchainEvent);
            }

            processedEventRepository.save(new ProcessedEvent(requestEventId, "CREDENTIAL_BLOCKCHAIN", Instant.now()));
        }
    }
}
