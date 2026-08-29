package com.eventone.blockchainservice.worker;

import com.eventone.blockchainservice.domain.ProcessedEvent;
import com.eventone.blockchainservice.dto.BlockchainResponse;
import com.eventone.blockchainservice.repository.ProcessedEventRepository;
import com.eventone.blockchainservice.service.BlockchainActionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BlockchainWorkerTest {

    @Mock
    private BlockchainActionService actionService;
    
    @Mock
    private ProcessedEventRepository processedEventRepository;
    
    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private BlockchainWorker worker;

    private Map<String, Object> outboxEvent;
    private Map<String, Object> payload;

    @BeforeEach
    void setUp() {
        payload = new HashMap<>();
        payload.put("eventId", "EVT-123");
        payload.put("ticketId", "TKT-456");
        payload.put("walletAddress", "0x123");
        payload.put("chainId", 31337);

        outboxEvent = new HashMap<>();
        outboxEvent.put("id", "OUT-001");
        outboxEvent.put("eventType", "TICKET_ISSUANCE_REQUESTED");
        outboxEvent.put("payload", payload);
    }

    @Test
    void testConsume_Success() throws Exception {
        when(processedEventRepository.findByEventIdAndConsumer("OUT-001", "TICKET_ISSUANCE")).thenReturn(Optional.empty());
        when(actionService.issueTicket("0x123", "EVT-123")).thenReturn(new BlockchainResponse("0xabc", "CONFIRMED", "ENTITY-1"));

        worker.consumeTicketCommands(outboxEvent);

        // Verify action service called once
        verify(actionService, times(1)).issueTicket("0x123", "EVT-123");
        
        // Verify kafka published domain event
        ArgumentCaptor<Map<String, Object>> eventCaptor = ArgumentCaptor.forClass(Map.class);
        verify(kafkaTemplate, times(1)).send(eq("eventone.blockchain.events"), eq("TKT-456"), eventCaptor.capture());
        
        Map<String, Object> publishedEvent = eventCaptor.getValue();
        assertEquals("TICKET_BLOCKCHAIN_CONFIRMED", publishedEvent.get("eventType"));
        assertEquals("0xabc", publishedEvent.get("transactionHash"));
        
        // Verify idempotency record saved
        verify(processedEventRepository, times(1)).save(any(ProcessedEvent.class));
    }

    @Test
    void testConsume_DuplicateMessage_Idempotent() {
        when(processedEventRepository.findByEventIdAndConsumer("OUT-001", "TICKET_ISSUANCE"))
            .thenReturn(Optional.of(new ProcessedEvent("OUT-001", "TICKET_ISSUANCE", Instant.now())));

        worker.consumeTicketCommands(outboxEvent);

        // Verify nothing happened because it was a duplicate
        verify(actionService, never()).issueTicket(anyString(), anyString());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }
}
