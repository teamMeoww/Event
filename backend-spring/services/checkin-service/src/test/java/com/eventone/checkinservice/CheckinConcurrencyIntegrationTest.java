package com.eventone.checkinservice;

import com.eventone.checkinservice.domain.CheckIn;
import com.eventone.checkinservice.dto.CheckInRequest;
import com.eventone.checkinservice.dto.CheckInResponse;
import com.eventone.checkinservice.outbox.OutboxEvent;
import com.eventone.checkinservice.outbox.OutboxRepository;
import com.eventone.checkinservice.repository.CheckInRepository;
import com.eventone.checkinservice.service.CheckinService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
public class CheckinConcurrencyIntegrationTest {

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
    private CheckinService checkinService;

    @Autowired
    private CheckInRepository checkInRepository;

    @Autowired
    private OutboxRepository outboxRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    private final String secret = "defaultSuperSecretKeyForQrGenerationThatIsAtLeast32Bytes";
    private SecretKey key;

    @BeforeEach
    void setUp() {
        checkInRepository.deleteAll();
        outboxRepository.deleteAll();
        mongoTemplate.dropCollection("tickets");
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void testConcurrentCheckinsYieldExactlyOneSuccess() throws InterruptedException {
        // 1. Create an active ticket in MongoDB directly
        String ticketId = "TICKET_100";
        Map<String, Object> ticket = new HashMap<>();
        ticket.put("_id", ticketId);
        ticket.put("eventId", "EVT_CONCURRENCY");
        ticket.put("userId", "USR_1");
        ticket.put("status", "ACTIVE");
        mongoTemplate.insert(ticket, "tickets");

        // 2. Generate a valid QR token
        String qrToken = Jwts.builder()
                .subject(ticketId)
                .claim("eventId", "EVT_CONCURRENCY")
                .claim("nonce", UUID.randomUUID().toString())
                .expiration(new Date(System.currentTimeMillis() + 60000))
                .signWith(key)
                .compact();

        // 3. Prepare concurrent requests
        int threadCount = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threadCount);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        CheckInRequest request = new CheckInRequest();
        request.setEventId("EVT_CONCURRENCY");
        request.setQrToken(qrToken);

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    latch.await(); // wait until all threads are ready
                    CheckInResponse res = checkinService.performCheckIn(request, "SCANNER_1");
                    if (res.isSuccess()) {
                        successCount.incrementAndGet();
                    } else {
                        failureCount.incrementAndGet();
                    }
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                } finally {
                    done.countDown();
                }
            });
        }

        latch.countDown(); // release all threads at once!
        done.await(); // wait for all to finish

        // 4. Verification
        assertThat(successCount.get()).isEqualTo(1);
        assertThat(failureCount.get()).isEqualTo(threadCount - 1);

        List<CheckIn> checkIns = checkInRepository.findAll();
        List<OutboxEvent> outboxEvents = outboxRepository.findAll();

        assertThat(checkIns).hasSize(1);
        assertThat(outboxEvents).hasSize(1);
        
        Map updatedTicket = mongoTemplate.findById(ticketId, Map.class, "tickets");
        assertThat(updatedTicket.get("status")).isEqualTo("CHECKED_IN");
    }
}
