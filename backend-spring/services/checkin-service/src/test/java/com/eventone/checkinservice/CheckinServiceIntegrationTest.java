package com.eventone.checkinservice;

import com.eventone.checkinservice.domain.CheckIn;
import com.eventone.checkinservice.dto.CheckInRequest;
import com.eventone.checkinservice.dto.CheckInResponse;
import com.eventone.checkinservice.repository.CheckInRepository;
import com.eventone.checkinservice.service.CheckinService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
public class CheckinServiceIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:6.0"));

    @Container
    static GenericContainer<?> redisContainer = new GenericContainer<>(DockerImageName.parse("redis:7.0")).withExposedPorts(6379);

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        registry.add("spring.data.redis.host", redisContainer::getHost);
        registry.add("spring.data.redis.port", redisContainer::getFirstMappedPort);
        registry.add("eventone.qr.secret", () -> "defaultSuperSecretKeyForQrGenerationThatIsAtLeast32Bytes");
    }

    @Autowired
    private CheckinService checkinService;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private CheckInRepository checkInRepository;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Value("${eventone.qr.secret:defaultSuperSecretKeyForQrGenerationThatIsAtLeast32Bytes}")
    private String secret;

    private SecretKey key;

    @BeforeEach
    void setUp() {
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        mongoTemplate.dropCollection("tickets");
        mongoTemplate.dropCollection("checkins");
        mongoTemplate.dropCollection("outbox_events");
        redisTemplate.getConnectionFactory().getConnection().serverCommands().flushAll();
    }

    private String generateQr(String ticketId, String eventId, int ttlSeconds) {
        return Jwts.builder()
                .subject(ticketId)
                .claim("eventId", eventId)
                .claim("nonce", UUID.randomUUID().toString())
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plus(ttlSeconds, ChronoUnit.SECONDS)))
                .signWith(key)
                .compact();
    }

    private void seedTicket(String ticketId, String status) {
        Map<String, Object> ticket = new HashMap<>();
        ticket.put("_id", ticketId);
        ticket.put("status", status);
        ticket.put("eventId", "EVT-1");
        ticket.put("userId", "USR-1");
        mongoTemplate.insert(ticket, "tickets");
    }

    @Test
    void testReplayAttack() {
        seedTicket("TKT-REPLAY", "ACTIVE");
        String qr = generateQr("TKT-REPLAY", "EVT-1", 60);

        CheckInRequest req = new CheckInRequest();
        req.setQrToken(qr);
        req.setEventId("EVT-1");

        CheckInResponse res1 = checkinService.performCheckIn(req, "SCANNER-1");
        assertTrue(res1.isSuccess());

        CheckInResponse res2 = checkinService.performCheckIn(req, "SCANNER-2");
        assertFalse(res2.isSuccess());
        assertEquals("ALREADY_USED", res2.getCode());
    }

    @Test
    void testExpiredQr() throws InterruptedException {
        seedTicket("TKT-EXP", "ACTIVE");
        String qr = generateQr("TKT-EXP", "EVT-1", 1);
        
        Thread.sleep(1500); // Wait for expiration

        CheckInRequest req = new CheckInRequest();
        req.setQrToken(qr);
        req.setEventId("EVT-1");

        CheckInResponse res = checkinService.performCheckIn(req, "SCANNER-1");
        assertFalse(res.isSuccess());
        assertEquals("EXPIRED", res.getCode());
    }

    @Test
    void testWrongEvent() {
        seedTicket("TKT-EVT", "ACTIVE");
        String qr = generateQr("TKT-EVT", "EVT-2", 60);

        CheckInRequest req = new CheckInRequest();
        req.setQrToken(qr);
        req.setEventId("EVT-1");

        CheckInResponse res = checkinService.performCheckIn(req, "SCANNER-1");
        assertFalse(res.isSuccess());
        assertEquals("WRONG_EVENT", res.getCode());
    }

    @Test
    void testConcurrentScans() throws InterruptedException {
        seedTicket("TKT-CONCUR", "ACTIVE");
        String qr = generateQr("TKT-CONCUR", "EVT-1", 60);

        CheckInRequest req = new CheckInRequest();
        req.setQrToken(qr);
        req.setEventId("EVT-1");

        int threadCount = 100;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threadCount);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    latch.await();
                    CheckInResponse res = checkinService.performCheckIn(req, "SCANNER-X");
                    if (res.isSuccess()) successCount.incrementAndGet();
                    else failureCount.incrementAndGet();
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                } finally {
                    done.countDown();
                }
            });
        }

        latch.countDown(); // start all
        done.await(); // wait for all

        assertEquals(1, successCount.get());
        assertEquals(99, failureCount.get());

        // Verify exactly one CheckIn record
        assertEquals(1, checkInRepository.count());

        // Verify Ticket is CHECKED_IN
        Map ticket = mongoTemplate.findOne(new Query(Criteria.where("_id").is("TKT-CONCUR")), Map.class, "tickets");
        assertEquals("CHECKED_IN", ticket.get("status"));
    }
}
