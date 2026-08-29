package com.eventone.credentialservice;

import com.eventone.credentialservice.domain.Credential;
import com.eventone.credentialservice.repository.CredentialRepository;
import com.eventone.credentialservice.service.CredentialService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
public class DuplicateKafkaEventTest {

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
    private CredentialService credentialService;

    @Autowired
    private CredentialRepository credentialRepository;

    @BeforeEach
    void setUp() {
        credentialRepository.deleteAll();
    }

    @Test
    void testDuplicateCheckInEventIsIdempotent() {
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("eventId", "EVT_1");
        payload.put("ticketId", "TICKET_1");
        payload.put("userId", "USR_1");
        payload.put("walletAddress", "0xTestWallet");
        payload.put("blockchainEnabled", false);
        
        // Send first event
        credentialService.processCheckinCompleted(payload);
        
        // Send exact same event again
        credentialService.processCheckinCompleted(payload);

        // Verify only ONE credential was created
        List<Credential> credentials = credentialRepository.findByUserId("USR_1");
        assertThat(credentials).hasSize(1);
    }
}
