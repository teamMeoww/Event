package com.eventone.verificationservice;

import com.eventone.verificationservice.dto.PublicTicketVerificationResponse;
import com.eventone.verificationservice.service.VerificationOrchestrator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
public class VerificationOrchestratorTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:6.0"));

    @Container
    static GenericContainer<?> redisContainer = new GenericContainer<>(DockerImageName.parse("redis:7.0")).withExposedPorts(6379);

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        registry.add("spring.data.redis.host", redisContainer::getHost);
        registry.add("spring.data.redis.port", redisContainer::getFirstMappedPort);
    }

    @Autowired
    private VerificationOrchestrator orchestrator;

    @Test
    void testValidTicketVerification() {
        PublicTicketVerificationResponse res = orchestrator.verifyTicket("TKT_123");
        assertEquals("VALID", res.getStatus());
        assertEquals("VERIFIED", res.getBlockchain().getStatus());
        assertEquals("1", res.getBlockchain().getTokenId());
    }

    @Test
    void testRevokedTicketVerification() {
        PublicTicketVerificationResponse res = orchestrator.verifyTicket("TKT_REVOKED");
        assertEquals("REVOKED", res.getStatus());
        assertEquals("REVOKED", res.getBlockchain().getStatus());
    }
    
    @Test
    void testMismatchTicketVerification() {
        PublicTicketVerificationResponse res = orchestrator.verifyTicket("TKT_INVALID");
        assertEquals("INVALID", res.getStatus());
        assertEquals("INVALID", res.getBlockchain().getStatus());
        assertEquals("MISMATCH", res.getBlockchain().getReconciliation());
    }

    @Test
    void testNotFoundTicketVerification() {
        PublicTicketVerificationResponse res = orchestrator.verifyTicket("UNKNOWN");
        assertEquals("NOT_FOUND", res.getStatus());
    }
}
