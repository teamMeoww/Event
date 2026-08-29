package com.eventone.ticketservice;

import com.eventone.ticketservice.domain.Ticket;
import com.eventone.ticketservice.outbox.OutboxEvent;
import com.eventone.ticketservice.outbox.OutboxEventRepository;
import com.eventone.ticketservice.repository.TicketRepository;
import com.eventone.ticketservice.service.TicketService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;

@SpringBootTest
@Testcontainers
public class TicketTransactionIntegrationTest {

    // Must be started as a replica set to support transactions!
    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:6.0"))
            .withCommand("--replSet", "rs0");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @BeforeAll
    static void initReplicaSet() throws Exception {
        mongoDBContainer.execInContainer("mongosh", "--quiet", "--eval", "rs.initiate()");
    }

    @Autowired
    private TicketService ticketService;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @SpyBean
    private OutboxEventRepository spiedOutboxEventRepository;

    @BeforeEach
    void setUp() {
        ticketRepository.deleteAll();
        outboxEventRepository.deleteAll();
    }

    @Test
    void testSuccessfulTransactionCommitsBoth() {
        Ticket res = ticketService.createTicket("EVT_123", "USR_1", "0x123", true, true);

        List<Ticket> tickets = ticketRepository.findAll();
        List<OutboxEvent> outboxEvents = outboxEventRepository.findAll();

        assertThat(tickets).hasSize(1);
        assertThat(outboxEvents).hasSize(1);
        assertThat(outboxEvents.get(0).getAggregateId()).isEqualTo(tickets.get(0).getId());
    }

    @Test
    void testFailedTransactionRollsBackBoth() {
        // Force the outbox repository save to throw an exception, which should trigger a rollback of the ticket creation.
        doThrow(new RuntimeException("Simulated Outbox Failure")).when(spiedOutboxEventRepository).save(any());

        assertThrows(RuntimeException.class, () -> {
            ticketService.createTicket("EVT_123", "USR_1", "0x123", true, true);
        });

        // The transaction must roll back entirely, meaning NO ticket should exist in DB!
        List<Ticket> tickets = ticketRepository.findAll();
        List<OutboxEvent> outboxEvents = outboxEventRepository.findAll();

        assertThat(tickets).isEmpty();
        assertThat(outboxEvents).isEmpty();
    }
}
