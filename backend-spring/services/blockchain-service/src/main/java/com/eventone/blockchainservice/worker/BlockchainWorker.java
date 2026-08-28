package com.eventone.blockchainservice.worker;

import com.eventone.blockchainservice.domain.ProcessedEvent;
import com.eventone.blockchainservice.dto.BlockchainResponse;
import com.eventone.blockchainservice.repository.ProcessedEventRepository;
import com.eventone.blockchainservice.service.BlockchainActionService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class BlockchainWorker {

    private final BlockchainActionService actionService;
    private final ProcessedEventRepository processedEventRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public BlockchainWorker(BlockchainActionService actionService, 
                            ProcessedEventRepository processedEventRepository,
                            KafkaTemplate<String, Object> kafkaTemplate) {
        this.actionService = actionService;
        this.processedEventRepository = processedEventRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "eventone.ticket.commands", groupId = "eventone-blockchain-workers")
    @SuppressWarnings("unchecked")
    public void consumeTicketCommands(@Payload Map<String, Object> outboxEvent) {
        String eventId = (String) outboxEvent.getOrDefault("eventId", outboxEvent.get("id"));
        
        // Idempotency Guard
        if (processedEventRepository.findByEventIdAndConsumer(eventId, "TICKET_ISSUANCE").isPresent()) {
            return; // Already processed
        }

        String eventType = (String) outboxEvent.get("eventType");
        if ("TICKET_ISSUANCE_REQUESTED".equals(eventType)) {
            Map<String, Object> payload = (Map<String, Object>) outboxEvent.get("payload");
            String ticketId = (String) payload.get("ticketId");
            String attendeeAddress = (String) payload.get("walletAddress");
            String publicEventId = (String) payload.get("eventId");
            String chainId = payload.get("chainId").toString();
            String issuanceKey = (String) payload.get("issuanceKey");

            try {
                BlockchainResponse resp = actionService.issueTicket(attendeeAddress, publicEventId, issuanceKey);

                // Publish Domain Event back
                Map<String, Object> responseEvent = new HashMap<>();
                if ("CONFIRMED".equals(resp.getStatus())) {
                    responseEvent.put("eventType", "TICKET_BLOCKCHAIN_CONFIRMED");
                    responseEvent.put("blockchainTicketId", resp.getTokenId()); 
                    responseEvent.put("transactionHash", resp.getTransactionHash());
                } else if ("PENDING".equals(resp.getStatus()) || "UNKNOWN".equals(resp.getStatus())) {
                    responseEvent.put("eventType", "TICKET_BLOCKCHAIN_PENDING");
                    responseEvent.put("transactionHash", resp.getTransactionHash());
                } else if ("REVERTED".equals(resp.getStatus()) || "FAILED".equals(resp.getStatus())) {
                    responseEvent.put("eventType", "TICKET_BLOCKCHAIN_FAILED");
                    responseEvent.put("transactionHash", resp.getTransactionHash());
                } else {
                    return; // Wait for monitor to confirm if it was PENDING
                }
                
                responseEvent.put("ticketId", ticketId);
                responseEvent.put("chainId", chainId);
                responseEvent.put("timestamp", Instant.now().toString());
                
                kafkaTemplate.send("eventone.blockchain.events", Objects.requireNonNull(ticketId, "ticketId"), responseEvent);

                // Mark processed
                processedEventRepository.save(new ProcessedEvent(eventId, "TICKET_ISSUANCE", Instant.now()));

            } catch (Exception e) {
                // Transient errors throw so the DLQ retries
                throw new RuntimeException("Transient failure processing TICKET_ISSUANCE", e);
            }
        }
    }
}
