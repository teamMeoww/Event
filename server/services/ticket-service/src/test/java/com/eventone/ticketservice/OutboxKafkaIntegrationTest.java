package com.eventone.ticketservice;

import com.eventone.ticketservice.dto.TicketCreationRequest;
import com.eventone.ticketservice.outbox.OutboxEvent;
import com.eventone.ticketservice.outbox.OutboxEventRepository;
import com.eventone.ticketservice.repository.TicketRepository;
import com.eventone.ticketservice.service.TicketService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
    "spring.kafka.consumer.auto-offset-reset=earliest",
    "spring.kafka.consumer.group-id=outbox-test-group"
})
@Testcontainers
public class OutboxKafkaIntegrationTest {

    @Container
    @SuppressWarnings("resource")
    static MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:6.0"))
            .withCommand("--replSet", "rs0");

    @Container
    static KafkaContainer kafkaContainer = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.4.0"));

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        registry.add("spring.kafka.bootstrap-servers", kafkaContainer::getBootstrapServers);
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

    private static CountDownLatch latch;
    private static String receivedKey;
    private static String receivedTopic;

    @BeforeEach
    void setUp() {
        ticketRepository.deleteAll();
        outboxEventRepository.deleteAll();
        latch = new CountDownLatch(1);
        receivedKey = null;
        receivedTopic = null;
    }

    @KafkaListener(topics = "eventone.ticket.commands", groupId = "outbox-test-group")
    public void listen(ConsumerRecord<String, Object> record) {
        receivedKey = record.key();
        receivedTopic = record.topic();
        latch.countDown();
    }

    @Test
    void testEndToEndOutboxDelivery() throws Exception {
        // 1. Mutate business state
        TicketCreationRequest request = new TicketCreationRequest();
        request.setEventId("TEST_EVENT_OB");
        request.setUserId("TEST_USER_OB");
        request.setWalletAddress("0x1234567890abcdef1234567890abcdef12345678");
        request.setBlockchainEnabled(true);
        request.setHasVerifiedWallet(true);
        
        var ticket = ticketService.createTicket(request);

        // 2. Verify MongoDB transaction is atomic
        assertThat(ticketRepository.findById(Objects.requireNonNull(ticket.getId(), "ticketId"))).isPresent();
        List<OutboxEvent> outboxEvents = outboxEventRepository.findAll();
        assertThat(outboxEvents).hasSize(1);
        
        OutboxEvent event = outboxEvents.get(0);
        assertThat(event.getAggregateId()).isEqualTo(ticket.getId());
        
        // At this exact moment, the scheduled OutboxPublisher might not have run yet.
        // It's configured to run every 5s, so we wait up to 10s for the test consumer.

        // 3. Verify Kafka receives the event
        boolean messageReceived = latch.await(15, TimeUnit.SECONDS);
        assertThat(messageReceived).isTrue();
        
        assertThat(receivedTopic).isEqualTo("eventone.ticket.commands");
        assertThat(receivedKey).isEqualTo(ticket.getId()); // Deterministic Ordering via aggregateId
        
        // 4. Verify outbox state transitions to PUBLISHED
        // Sleep briefly to ensure the publisher's transactional commit of status="PUBLISHED" has finished
        Thread.sleep(1000);
        OutboxEvent updatedEvent = outboxEventRepository.findById(Objects.requireNonNull(event.getId(), "eventId")).get();
        assertThat(updatedEvent.getStatus()).isEqualTo("PUBLISHED");
        assertThat(updatedEvent.getPublishedAt()).isNotNull();
    }
}
