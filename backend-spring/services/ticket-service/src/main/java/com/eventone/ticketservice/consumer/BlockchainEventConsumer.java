package com.eventone.ticketservice.consumer;

import com.eventone.ticketservice.domain.Ticket;
import com.eventone.ticketservice.repository.TicketRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class BlockchainEventConsumer {

    private final TicketRepository ticketRepository;
    private final ObjectMapper objectMapper;

    public BlockchainEventConsumer(TicketRepository ticketRepository, ObjectMapper objectMapper) {
        this.ticketRepository = ticketRepository;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "eventone.blockchain.events", groupId = "ticket-service-group")
    @SuppressWarnings("unchecked")
    public void consume(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String eventType = (String) event.get("eventType");
            String ticketId = (String) event.get("ticketId");
            
            if ("TICKET_BLOCKCHAIN_CONFIRMED".equals(eventType) || "TICKET_BLOCKCHAIN_FAILED".equals(eventType) || "TICKET_BLOCKCHAIN_PENDING".equals(eventType)) {
                if (ticketId == null) {
                    return;
                }
                Optional<Ticket> opt = ticketRepository.findById(ticketId);
                if (opt.isPresent()) {
                    Ticket t = opt.get();
                    if ("TICKET_BLOCKCHAIN_CONFIRMED".equals(eventType)) {
                        t.setBlockchainStatus("CONFIRMED");
                        t.setBlockchainTicketId((String) event.get("blockchainTicketId"));
                        t.setTransactionHash((String) event.get("transactionHash"));
                    } else if ("TICKET_BLOCKCHAIN_PENDING".equals(eventType)) {
                        t.setBlockchainStatus("PENDING");
                        if (event.get("transactionHash") != null) {
                            t.setTransactionHash((String) event.get("transactionHash"));
                        }
                    } else {
                        t.setBlockchainStatus("FAILED");
                        if (event.get("transactionHash") != null) {
                            t.setTransactionHash((String) event.get("transactionHash"));
                        }
                    }
                    ticketRepository.save(t);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
