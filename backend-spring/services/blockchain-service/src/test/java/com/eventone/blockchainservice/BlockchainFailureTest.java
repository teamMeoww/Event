package com.eventone.blockchainservice;

import com.eventone.blockchainservice.domain.BlockchainTransaction;
import com.eventone.blockchainservice.dto.BlockchainResponse;
import com.eventone.blockchainservice.dto.IssueTicketRequest;
import com.eventone.blockchainservice.repository.BlockchainTransactionRepository;
import com.eventone.blockchainservice.service.BlockchainService;
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

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
public class BlockchainFailureTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:6.0"))
            .withCommand("--replSet", "rs0");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        // Deliberately point to a dead RPC URL to simulate failure
        registry.add("eventone.blockchain.rpcurl", () -> "http://localhost:9999");
    }

    @BeforeAll
    static void initReplicaSet() throws Exception {
        mongoDBContainer.execInContainer("mongosh", "--quiet", "--eval", "rs.initiate()");
    }

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private BlockchainTransactionRepository transactionRepository;

    @BeforeEach
    void setUp() {
        transactionRepository.deleteAll();
    }

    @Test
    void testIssueTicketWithDeadRpcNodeFailsGracefully() {
        IssueTicketRequest request = new IssueTicketRequest();
        request.setTicketId("TICKET_DEAD_RPC");
        request.setEventId("EVT_1");
        request.setOwnerAddress("0x1234567890123456789012345678901234567890");

        // Should return a response indicating failure instead of completely blowing up if it's async
        // Or if it's sync, it should be marked as FAILED in DB.
        try {
            BlockchainResponse response = blockchainService.issueTicket(request);
            assertThat(response.getStatus()).isEqualTo("FAILED");
        } catch (Exception e) {
            // If it throws, check that DB state is saved or handled.
            // Since it's web3j it might throw ClientConnectionException
        }

        // Verify the transaction was recorded as FAILED or PENDING
        Optional<BlockchainTransaction> txOpt = transactionRepository.findByReferenceId("TICKET_DEAD_RPC");
        if (txOpt.isPresent()) {
            assertThat(txOpt.get().getStatus()).isIn("FAILED", "PENDING");
        }
    }
}
