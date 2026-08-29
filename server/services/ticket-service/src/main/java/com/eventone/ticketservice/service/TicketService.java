package com.eventone.ticketservice.service;

import com.eventone.ticketservice.domain.Ticket;
import com.eventone.ticketservice.domain.TicketStatus;
import com.eventone.ticketservice.dto.TicketCreationRequest;
import com.eventone.ticketservice.outbox.OutboxEvent;
import com.eventone.ticketservice.outbox.OutboxEventRepository;
import com.eventone.ticketservice.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Locale;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final WebClient webClient;

    @Value("${eventone.blockchain.chain-id:31337}")
    private String blockchainChainId;

    public TicketService(TicketRepository ticketRepository, OutboxEventRepository outboxEventRepository, WebClient.Builder webClientBuilder) {
        this.ticketRepository = ticketRepository;
        this.outboxEventRepository = outboxEventRepository;
        this.webClient = webClientBuilder.baseUrl("http://wallet-service:8084").build();
    }

    public Ticket createTicket(TicketCreationRequest request, String jwtToken) {
        // Fetch wallet securely
        boolean hasVerifiedWallet = false;
        String walletAddress = request.getWalletAddress();
        
        try {
            Map resp = webClient.get()
                .uri("/api/v1/wallet")
                .header("Authorization", jwtToken)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
                
            if (resp != null && resp.get("data") != null) {
                Map data = (Map) resp.get("data");
                if (Boolean.TRUE.equals(data.get("verified"))) {
                    hasVerifiedWallet = true;
                    walletAddress = (String) data.get("address");
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch wallet status: " + e.getMessage());
        }
        
        boolean blockchainEnabled = request.getBlockchainEnabled() == null || request.getBlockchainEnabled();
        return createTicket(request.getEventId(), request.getUserId(), walletAddress, blockchainEnabled, hasVerifiedWallet);
    }

    @Transactional
    public Ticket createTicket(String eventId, String userId, String walletAddress, boolean blockchainEnabled, boolean hasVerifiedWallet) {
        Ticket ticket = new Ticket();
        ticket.setPublicId(UUID.randomUUID().toString());
        ticket.setRegistrationId("REG_" + UUID.randomUUID().toString().substring(0, 8));
        ticket.setUserId(userId);
        ticket.setEventId(eventId);
        ticket.setTicketType("GENERAL");
        ticket.setStatus(TicketStatus.ACTIVE);
        ticket.setWalletAddress(walletAddress);
        ticket.setIssuedAt(Instant.now());
        ticket.setUpdatedAt(Instant.now());
        ticket.setBlockchainEnabled(blockchainEnabled);

        if (blockchainEnabled) {
            if (!hasVerifiedWallet || walletAddress == null || walletAddress.isEmpty()) {
                ticket.setBlockchainStatus("NOT_ELIGIBLE");
            } else {
                ticket.setBlockchainStatus("PENDING");
            }
        } else {
            ticket.setBlockchainStatus("NOT_ENABLED");
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        if (blockchainEnabled && "PENDING".equals(savedTicket.getBlockchainStatus())) {
            String issuanceKey = buildIssuanceKey(eventId, walletAddress);
            OutboxEvent outboxEvent = new OutboxEvent();
            outboxEvent.setEventId("TICKET_ISSUANCE_REQUESTED_" + issuanceKey);
            outboxEvent.setAggregateType("TICKET");
            outboxEvent.setAggregateId(savedTicket.getId());
            outboxEvent.setEventType("TICKET_ISSUANCE_REQUESTED");
            outboxEvent.setStatus("PENDING");
            outboxEvent.setAttempts(0);
            outboxEvent.setCreatedAt(Instant.now());

            Map<String, Object> payload = new HashMap<>();
            payload.put("eventId", eventId);
            payload.put("ticketId", savedTicket.getId());
            payload.put("userId", userId);
            payload.put("walletAddress", walletAddress);
            payload.put("issuanceKey", issuanceKey);
            payload.put("chainId", blockchainChainId);
            
            outboxEvent.setPayload(payload);
            outboxEventRepository.save(outboxEvent);
        }

        return savedTicket;
    }

    private String buildIssuanceKey(String eventId, String walletAddress) {
        String normalizedWalletAddress = walletAddress == null ? "" : walletAddress.trim().toLowerCase(Locale.ROOT);
        return "TICKET_" + eventId + "_" + normalizedWalletAddress;
    }
}
