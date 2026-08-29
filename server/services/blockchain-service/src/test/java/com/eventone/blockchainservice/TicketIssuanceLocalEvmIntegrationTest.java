package com.eventone.blockchainservice;

import com.eventone.blockchainservice.dto.BlockchainResponse;
import com.eventone.blockchainservice.service.BlockchainActionService;
import com.eventone.blockchainservice.service.Web3Client;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Uint64;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.crypto.Hash;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class TicketIssuanceLocalEvmIntegrationTest {

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", () -> System.getenv().getOrDefault("EVENTONE_MONGODB_URI", "mongodb://localhost:27017/eventone?replicaSet=rs0"));
        registry.add("blockchain.rpc-url", () -> System.getenv().getOrDefault("EVENTONE_BLOCKCHAIN_RPCURL", "http://localhost:8545"));
        registry.add("blockchain.chain-id", () -> System.getenv().getOrDefault("EVENTONE_BLOCKCHAIN_CHAINID", "31337"));
        registry.add("blockchain.private-key", () -> System.getenv().getOrDefault("EVENTONE_BLOCKCHAIN_PRIVATEKEY", "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"));
        registry.add("blockchain.ticket-contract", () -> System.getenv().getOrDefault("EVENTONE_TICKET_CONTRACT", "0xTBD"));
    }

    @Autowired
    private BlockchainActionService blockchainActionService;

    @Autowired
    private Web3Client web3Client;

        @BeforeAll
        static void initReplicaSet() throws Exception {
                String mongoUri = System.getenv().getOrDefault("EVENTONE_MONGODB_URI", "mongodb://localhost:27017/eventone?replicaSet=rs0");
                runCommand("mongosh", mongoUri, "--quiet", "--eval", "try { rs.status(); } catch (e) { rs.initiate(); }");
    }

    @Test
    void shouldMintTicketOnLocalEvmAndMatchOwnerAndEvent() throws Exception {
        String ticketContractAddress = System.getenv().getOrDefault("EVENTONE_TICKET_CONTRACT", "0xTBD");
        Assumptions.assumeTrue(!"0xTBD".equals(ticketContractAddress), "EVENTONE_TICKET_CONTRACT must point to a deployed EventOneTicket contract");

        String attendeeAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        String publicEventId = "EVT_LOCAL_001";

        BlockchainResponse response = blockchainActionService.issueTicket(attendeeAddress, publicEventId);

        assertThat(response.getStatus()).isEqualTo("CONFIRMED");
        assertThat(response.getTransactionHash()).isNotBlank();
        assertThat(response.getTokenId()).isNotBlank();

        BigInteger tokenId = new BigInteger(response.getTokenId());
        String owner = callAddress(new Function(
                "ownerOf",
                Arrays.asList(new Uint256(tokenId)),
                Arrays.asList(new TypeReference<Address>() {})
        ));

        List<Type<?>> ticketDetails = callContract(new Function(
                "ticketDetails",
                Arrays.asList(new Uint256(tokenId)),
                Arrays.asList(
                        new TypeReference<Bytes32>() {},
                        new TypeReference<Uint8>() {},
                        new TypeReference<Uint64>() {}
                )
        ));

        TransactionReceipt receipt = web3Client.getWeb3j().ethGetTransactionReceipt(response.getTransactionHash()).send().getTransactionReceipt().orElseThrow();
        String expectedTopic0 = EventEncoder.encode(new Event(
                "TicketMinted",
                Arrays.asList(
                        new TypeReference<Uint256>(true) {},
                        new TypeReference<Bytes32>(true) {},
                        new TypeReference<Address>(true) {}
                )
        ));

        assertThat(owner).isEqualToIgnoringCase(attendeeAddress);
        assertThat(((Bytes32) ticketDetails.get(0)).getValue()).isEqualTo(Hash.sha3(publicEventId.getBytes(StandardCharsets.UTF_8)));
        assertThat(receipt.getLogs()).isNotEmpty();
        assertThat(receipt.getLogs().get(0).getTopics().get(0)).isEqualTo(expectedTopic0);
        assertThat(receipt.getLogs().get(0).getTopics().get(1)).isEqualTo(String.format("0x%064x", tokenId));
    }

        private String callAddress(Function function) throws Exception {
                List<Type<?>> result = callContract(function);
        return (String) result.get(0).getValue();
    }

        @SuppressWarnings("unchecked")
        private List<Type<?>> callContract(Function function) throws Exception {
        String encodedFunction = FunctionEncoder.encode(function);
        String rawResult = web3Client.getWeb3j()
                .ethCall(Transaction.createEthCallTransaction(null, System.getenv().getOrDefault("EVENTONE_TICKET_CONTRACT", "0xTBD"), encodedFunction), DefaultBlockParameterName.LATEST)
                .send()
                .getValue();
                return (List<Type<?>>) (List<?>) FunctionReturnDecoder.decode(rawResult, function.getOutputParameters());
    }

        private static void runCommand(String... command) throws IOException, InterruptedException {
                Process process = new ProcessBuilder(command).redirectErrorStream(true).start();
                int exitCode = process.waitFor();
                if (exitCode != 0) {
                        throw new IllegalStateException("Command failed: " + String.join(" ", command));
                }
        }
}