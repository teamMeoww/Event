package com.eventone.credentialservice.service;

import com.eventone.credentialservice.domain.Credential;
import com.eventone.credentialservice.domain.CredentialStatus;
import com.eventone.credentialservice.domain.CredentialType;
import com.eventone.credentialservice.outbox.OutboxEvent;
import com.eventone.credentialservice.outbox.OutboxRepository;
import com.eventone.credentialservice.repository.CredentialRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.Locale;
import java.util.Objects;

@Service
public class CredentialService {

    private static final Logger log = LoggerFactory.getLogger(CredentialService.class);
    private final CredentialRepository credentialRepository;
    private final OutboxRepository outboxRepository;

    @Value("${eventone.blockchain.chain-id:31337}")
    private Integer blockchainChainId;

    @Value("${eventone.blockchain.credential-contract:${EVENTONE_CREDENTIAL_CONTRACT:0xTBD}}")
    private String credentialContractAddress;

    public CredentialService(CredentialRepository credentialRepository, OutboxRepository outboxRepository) {
        this.credentialRepository = credentialRepository;
        this.outboxRepository = outboxRepository;
    }

    @Transactional
    public void processCheckinCompleted(Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        String eventId = (String) payload.get("eventId");
        String ticketId = (String) payload.get("ticketId");
        String walletAddress = (String) payload.get("walletAddress");
        Boolean blockchainEnabled = (Boolean) payload.getOrDefault("blockchainEnabled", Boolean.TRUE);
        CredentialType credentialType = CredentialType.ATTENDANCE;

        if (walletAddress == null || walletAddress.isBlank()) {
            log.warn("Check-in completed without wallet address; skipping blockchain credential issuance for userId={}, eventId={}", userId, eventId);
            return;
        }

        try {
            Credential credential = new Credential();
            credential.setPublicId("CRD_" + UUID.randomUUID().toString());
            credential.setUserId(userId);
            credential.setEventId(eventId);
            credential.setTicketId(ticketId);
            credential.setWalletAddress(walletAddress);
            credential.setType(credentialType);
            credential.setTitle("Attendance Credential");
            credential.setStatus(CredentialStatus.PENDING);
            credential.setMetadataURI("ipfs://eventone/credential/" + credential.getPublicId());
            credential.setContractAddress(credentialContractAddress);
            credential.setChainId(blockchainChainId);
            credential.setCreatedAt(Instant.now());
            credential.setUpdatedAt(Instant.now());

            credentialRepository.save(credential);

            if (!Boolean.TRUE.equals(blockchainEnabled)) {
                log.info("Blockchain disabled for check-in credential issuance; credential remains pending in MongoDB only: {}", credential.getPublicId());
                return;
            }

            String issuanceKey = buildIssuanceKey(userId, eventId, credentialType.name());

            OutboxEvent outboxEvent = new OutboxEvent();
            outboxEvent.setEventId("CREDENTIAL_ISSUANCE_REQUESTED_" + issuanceKey);
            outboxEvent.setAggregateType("Credential");
            outboxEvent.setAggregateId(credential.getId());
            outboxEvent.setEventType("CREDENTIAL_ISSUANCE_REQUESTED");
            outboxEvent.setStatus("PENDING");
            outboxEvent.setCreatedAt(Instant.now());

            Map<String, Object> outboxPayload = new HashMap<>();
            outboxPayload.put("credentialId", credential.getId());
            outboxPayload.put("credentialPublicId", credential.getPublicId());
            outboxPayload.put("userId", userId);
            outboxPayload.put("eventId", eventId);
            outboxPayload.put("ticketId", ticketId);
            outboxPayload.put("walletAddress", walletAddress);
            outboxPayload.put("chainId", credential.getChainId());
            outboxPayload.put("contractAddress", credentialContractAddress);
            outboxPayload.put("metadataURI", credential.getMetadataURI());
            outboxPayload.put("type", credential.getType().name());
            outboxPayload.put("issuanceKey", issuanceKey);

            outboxEvent.setPayload(outboxPayload);
            outboxRepository.save(outboxEvent);

        } catch (DuplicateKeyException e) {
            // Idempotency: Duplicate checkin event for same user + event + type
            log.info("Duplicate credential request ignored for userId: {}, eventId: {}", userId, eventId);
        }
    }

    @Transactional
    public void processBlockchainConfirmed(Map<String, Object> payload) {
        String credentialId = (String) payload.get("credentialId");
        String tokenId = (String) payload.get("tokenId");
        String transactionHash = (String) payload.get("transactionHash");

        Optional<Credential> credOpt = credentialRepository.findById(Objects.requireNonNull(credentialId, "credentialId"));
        if (credOpt.isPresent()) {
            Credential cred = credOpt.get();
            cred.setStatus(CredentialStatus.VERIFIED);
            cred.setTokenId(tokenId);
            cred.setTransactionHash(transactionHash);
            cred.setIssuedAt(Instant.now());
            cred.setUpdatedAt(Instant.now());
            credentialRepository.save(cred);
        }
    }

    @Transactional
    public void processBlockchainPending(Map<String, Object> payload) {
        String credentialId = (String) payload.get("credentialId");
        String transactionHash = (String) payload.get("transactionHash");

        Optional<Credential> credOpt = credentialRepository.findById(Objects.requireNonNull(credentialId, "credentialId"));
        if (credOpt.isPresent()) {
            Credential cred = credOpt.get();
            cred.setStatus(CredentialStatus.PENDING);
            cred.setTransactionHash(transactionHash);
            cred.setUpdatedAt(Instant.now());
            credentialRepository.save(cred);
        }
    }

    @Transactional
    public void processBlockchainFailed(Map<String, Object> payload) {
        String credentialId = (String) payload.get("credentialId");
        String transactionHash = (String) payload.get("transactionHash");
        String lastError = (String) payload.get("lastError");

        Optional<Credential> credOpt = credentialRepository.findById(Objects.requireNonNull(credentialId, "credentialId"));
        if (credOpt.isPresent()) {
            Credential cred = credOpt.get();
            cred.setStatus(CredentialStatus.FAILED);
            cred.setTransactionHash(transactionHash);
            cred.setLastError(lastError);
            cred.setUpdatedAt(Instant.now());
            credentialRepository.save(cred);
        }
    }

    @Transactional
    public void processBlockchainRevoked(Map<String, Object> payload) {
        String credentialId = (String) payload.get("credentialId");
        String transactionHash = (String) payload.get("transactionHash");

        Optional<Credential> credOpt = credentialRepository.findById(Objects.requireNonNull(credentialId, "credentialId"));
        if (credOpt.isPresent()) {
            Credential cred = credOpt.get();
            cred.setStatus(CredentialStatus.REVOKED);
            cred.setTransactionHash(transactionHash);
            cred.setRevokedAt(Instant.now());
            cred.setUpdatedAt(Instant.now());
            credentialRepository.save(cred);
        }
    }

    @Transactional
    public boolean revokeCredential(String id) {
        Optional<Credential> credOpt = credentialRepository.findById(Objects.requireNonNull(id, "credentialId"));
        if (credOpt.isPresent()) {
            Credential cred = credOpt.get();
            if (cred.getStatus() == CredentialStatus.REVOKED) {
                return true;
            }

            cred.setStatus(CredentialStatus.SUBMITTED);
            cred.setUpdatedAt(Instant.now());
            credentialRepository.save(cred);

            OutboxEvent outboxEvent = new OutboxEvent();
            String issuanceKey = buildIssuanceKey(cred.getUserId(), cred.getEventId(), cred.getType().name());
            outboxEvent.setEventId("CREDENTIAL_REVOCATION_REQUESTED_" + issuanceKey);
            outboxEvent.setAggregateType("Credential");
            outboxEvent.setAggregateId(cred.getId());
            outboxEvent.setEventType("CREDENTIAL_REVOCATION_REQUESTED");
            outboxEvent.setStatus("PENDING");
            outboxEvent.setCreatedAt(Instant.now());

            Map<String, Object> outboxPayload = new HashMap<>();
            outboxPayload.put("credentialId", cred.getId());
            outboxPayload.put("tokenId", cred.getTokenId());
            outboxPayload.put("userId", cred.getUserId());
            outboxPayload.put("eventId", cred.getEventId());
            outboxPayload.put("walletAddress", cred.getWalletAddress());
            outboxPayload.put("type", cred.getType().name());
            outboxPayload.put("issuanceKey", issuanceKey);
            outboxPayload.put("chainId", cred.getChainId());
            outboxPayload.put("contractAddress", cred.getContractAddress());
            outboxEvent.setPayload(outboxPayload);
            
            outboxRepository.save(outboxEvent);
            return true;
        }
        return false;
    }

    private String buildIssuanceKey(String userId, String eventId, String credentialType) {
        return "CRED_" + userId + "_" + eventId + "_" + credentialType.toLowerCase(Locale.ROOT);
    }
}
