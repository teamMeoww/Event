package com.eventone.credentialservice;

import com.eventone.credentialservice.domain.Credential;
import com.eventone.credentialservice.domain.CredentialStatus;
import com.eventone.credentialservice.outbox.OutboxEvent;
import com.eventone.credentialservice.outbox.OutboxRepository;
import com.eventone.credentialservice.repository.CredentialRepository;
import com.eventone.credentialservice.service.CredentialService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
public class CredentialServiceIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:6.0"));

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @Autowired
    private CredentialService credentialService;

    @Autowired
    private CredentialRepository credentialRepository;

    @Autowired
    private OutboxRepository outboxRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @BeforeEach
    void setUp() {
        mongoTemplate.dropCollection("credentials");
        mongoTemplate.dropCollection("credential_outbox_events");
    }

    @Test
    void testDuplicateCheckinIsIdempotent() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", "USR-1");
        payload.put("eventId", "EVT-1");
        payload.put("ticketId", "TKT-1");

        // Simulate identical CHECKIN_COMPLETED event twice
        credentialService.processCheckinCompleted(payload);
        credentialService.processCheckinCompleted(payload);

        // Only one credential should be created
        List<Credential> creds = credentialRepository.findAll();
        assertEquals(1, creds.size());
        assertEquals("USR-1", creds.get(0).getUserId());
        assertEquals(CredentialStatus.PENDING, creds.get(0).getStatus());

        // Only one outbox event
        List<OutboxEvent> outboxEvents = outboxRepository.findAll();
        assertEquals(1, outboxEvents.size());
        assertEquals("CREDENTIAL_ISSUANCE_REQUESTED", outboxEvents.get(0).getEventType());
    }

    @Test
    void testRevocation() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", "USR-2");
        payload.put("eventId", "EVT-2");
        payload.put("ticketId", "TKT-2");
        credentialService.processCheckinCompleted(payload);

        Credential cred = credentialRepository.findAll().get(0);
        
        // Revoke
        boolean revoked = credentialService.revokeCredential(cred.getId());
        assertTrue(revoked);

        Credential updatedCred = credentialRepository.findById(cred.getId()).get();
        assertEquals(CredentialStatus.REVOKED, updatedCred.getStatus());
        assertNotNull(updatedCred.getRevokedAt());

        List<OutboxEvent> outboxEvents = outboxRepository.findAll();
        assertEquals(2, outboxEvents.size());
        
        // Assert the second outbox event is revocation
        assertTrue(outboxEvents.stream().anyMatch(e -> "CREDENTIAL_REVOCATION_REQUESTED".equals(e.getEventType())));
    }
}
