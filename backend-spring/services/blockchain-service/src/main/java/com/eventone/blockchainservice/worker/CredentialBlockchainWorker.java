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
    public void processCredentialRequest(Map<String, Object> payload) {
        String eventType = (String) payload.getOrDefault("eventType", "CREDENTIAL_ISSUANCE_REQUESTED"); // Usually wrapped by Outbox publisher
        String credentialId = (String) payload.get("credentialId");
        
        if (processedEventRepository.existsById("CRED_REQ_" + credentialId + "_" + eventType)) {
            System.out.println("Duplicate credential request detected, ignoring: " + eventType);
            return;
        }

        System.out.println("Processing " + eventType + " for " + credentialId);

        if ("CREDENTIAL_ISSUANCE_REQUESTED".equals(eventType) || payload.containsKey("walletAddress")) {
            String eventId = (String) payload.getOrDefault("eventId", "UNKNOWN_EVENT");
            String walletAddress = (String) payload.get("walletAddress");
            String metadataURI = (String) payload.get("metadataURI");
            String type = (String) payload.get("type");

            var res = actionService.issueCredential(walletAddress, eventId, type, metadataURI, credentialId);

            if ("CONFIRMED".equals(res.getStatus())) {
                String mockTokenId = String.valueOf(Math.abs(res.getTransactionHash().hashCode()));
                
                Map<String, Object> confirmedPayload = new HashMap<>();
                confirmedPayload.put("credentialId", credentialId);
                confirmedPayload.put("userId", payload.get("userId"));
                confirmedPayload.put("eventId", eventId);
                confirmedPayload.put("tokenId", mockTokenId);
                confirmedPayload.put("transactionHash", res.getTransactionHash());
                confirmedPayload.put("chainId", payload.get("chainId"));
                confirmedPayload.put("status", "CONFIRMED");
                
                kafkaTemplate.send("eventone.credentials.events", credentialId, confirmedPayload);
            }
        } else if ("CREDENTIAL_REVOCATION_REQUESTED".equals(eventType) || payload.containsKey("tokenId")) {
            String tokenId = (String) payload.get("tokenId");
            var res = actionService.revokeCredential(credentialId, tokenId);
            
            if ("CONFIRMED".equals(res.getStatus())) {
                Map<String, Object> revokedPayload = new HashMap<>();
                revokedPayload.put("credentialId", credentialId);
                revokedPayload.put("status", "REVOKED_ON_CHAIN");
                revokedPayload.put("transactionHash", res.getTransactionHash());
                
                kafkaTemplate.send("eventone.credentials.events", credentialId, revokedPayload);
            }
        }
        
        processedEventRepository.save(new ProcessedEvent("CRED_REQ_" + credentialId + "_" + eventType));
    }
}
