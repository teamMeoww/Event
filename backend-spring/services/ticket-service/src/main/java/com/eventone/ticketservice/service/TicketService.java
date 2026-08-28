package com.eventone.ticketservice.service;

import com.eventone.ticketservice.domain.Ticket;
import com.eventone.ticketservice.domain.TicketStatus;
import com.eventone.ticketservice.outbox.OutboxEvent;
import com.eventone.ticketservice.outbox.OutboxEventRepository;
import com.eventone.ticketservice.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final OutboxEventRepository outboxEventRepository;

    public TicketService(TicketRepository ticketRepository, OutboxEventRepository outboxEventRepository) {
        this.ticketRepository = ticketRepository;
        this.outboxEventRepository = outboxEventRepository;
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
                // PROPOSED DECISION 1: Unverified Wallet on Blockchain-Enabled Event
                ticket.setBlockchainStatus("NOT_ELIGIBLE");
            } else {
                ticket.setBlockchainStatus("QUEUED");
            }
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        if (blockchainEnabled && "QUEUED".equals(savedTicket.getBlockchainStatus())) {
            OutboxEvent outboxEvent = new OutboxEvent();
            outboxEvent.setEventId("OUT_" + UUID.randomUUID());
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
            payload.put("chainId", 31337);
            
            outboxEvent.setPayload(payload);
            outboxEventRepository.save(outboxEvent);
        }

        return savedTicket;
    }
}
