package com.eventone.credentialservice.service;

import com.eventone.credentialservice.domain.Credential;
import com.eventone.credentialservice.domain.CredentialStatus;
import com.eventone.credentialservice.domain.CredentialType;
import com.eventone.credentialservice.outbox.OutboxEvent;
import com.eventone.credentialservice.outbox.OutboxRepository;
import com.eventone.credentialservice.repository.CredentialRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final OutboxRepository outboxRepository;

    public CredentialService(CredentialRepository credentialRepository, OutboxRepository outboxRepository) {
        this.credentialRepository = credentialRepository;
        this.outboxRepository = outboxRepository;
    }

    @Transactional
    public void processCheckinCompleted(Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        String eventId = (String) payload.get("eventId");
        String ticketId = (String) payload.get("ticketId");

        // Mock verification of wallet ownership
        String walletAddress = "0xMockVerifiedWalletAddress"; 
        if (walletAddress == null) {
            // Unverified wallet: block issuance
            return;
        }

        try {
            Credential credential = new Credential();
            credential.setPublicId("CRD_" + UUID.randomUUID().toString());
            credential.setUserId(userId);
            credential.setEventId(eventId);
            credential.setTicketId(ticketId);
            credential.setType(CredentialType.ATTENDANCE);
            credential.setTitle("Attendance Credential");
            credential.setStatus(CredentialStatus.PENDING);
            credential.setMetadataURI("ipfs://mock-metadata-" + credential.getPublicId());
            credential.setChainId(8453); // Base chain
            credential.setCreatedAt(Instant.now());
            credential.setUpdatedAt(Instant.now());

            credentialRepository.save(credential);

            OutboxEvent outboxEvent = new OutboxEvent();
            outboxEvent.setAggregateType("Credential");
            outboxEvent.setAggregateId(credential.getId());
            outboxEvent.setEventType("CREDENTIAL_ISSUANCE_REQUESTED");
            outboxEvent.setStatus("PENDING");
            outboxEvent.setCreatedAt(Instant.now());

            Map<String, Object> outboxPayload = new HashMap<>();
            outboxPayload.put("credentialId", credential.getId());
            outboxPayload.put("userId", userId);
            outboxPayload.put("eventId", eventId);
            outboxPayload.put("ticketId", ticketId);
            outboxPayload.put("walletAddress", walletAddress);
            outboxPayload.put("chainId", credential.getChainId());
            outboxPayload.put("metadataURI", credential.getMetadataURI());
            outboxPayload.put("type", credential.getType().name());

            outboxEvent.setPayload(outboxPayload);
            outboxRepository.save(outboxEvent);

        } catch (DuplicateKeyException e) {
            // Idempotency: Duplicate checkin event for same user + event + type
            System.out.println("Duplicate credential request ignored for userId: " + userId + ", eventId: " + eventId);
        }
    }

    @Transactional
    public void processBlockchainConfirmed(Map<String, Object> payload) {
        String credentialId = (String) payload.get("credentialId");
        String tokenId = (String) payload.get("tokenId");
        String transactionHash = (String) payload.get("transactionHash");

        Optional<Credential> credOpt = credentialRepository.findById(credentialId);
        if (credOpt.isPresent()) {
            Credential cred = credOpt.get();
            cred.setStatus(CredentialStatus.CONFIRMED);
            cred.setTokenId(tokenId);
            cred.setTransactionHash(transactionHash);
            cred.setIssuedAt(Instant.now());
            cred.setUpdatedAt(Instant.now());
            credentialRepository.save(cred);
        }
    }

    @Transactional
    public boolean revokeCredential(String id) {
        Optional<Credential> credOpt = credentialRepository.findById(id);
        if (credOpt.isPresent()) {
            Credential cred = credOpt.get();
            cred.setStatus(CredentialStatus.REVOKED);
            cred.setRevokedAt(Instant.now());
            cred.setUpdatedAt(Instant.now());
            credentialRepository.save(cred);

            OutboxEvent outboxEvent = new OutboxEvent();
            outboxEvent.setAggregateType("Credential");
            outboxEvent.setAggregateId(cred.getId());
            outboxEvent.setEventType("CREDENTIAL_REVOCATION_REQUESTED");
            outboxEvent.setStatus("PENDING");
            outboxEvent.setCreatedAt(Instant.now());

            Map<String, Object> outboxPayload = new HashMap<>();
            outboxPayload.put("credentialId", cred.getId());
            outboxPayload.put("tokenId", cred.getTokenId());
            outboxEvent.setPayload(outboxPayload);
            
            outboxRepository.save(outboxEvent);
            return true;
        }
        return false;
    }
}
