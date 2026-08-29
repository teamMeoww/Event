package com.eventone.blockchainservice;

import com.eventone.blockchainservice.dto.BlockchainResponse;
import com.eventone.blockchainservice.service.BlockchainActionService;
import com.eventone.blockchainservice.service.Web3Client;
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
import org.web3j.abi.datatypes.Utf8String;
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
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class CredentialIssuanceLocalEvmIntegrationTest {

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", () -> System.getenv().getOrDefault("EVENTONE_MONGODB_URI", "mongodb://localhost:27017/eventone?replicaSet=rs0"));
        registry.add("blockchain.rpc-url", () -> System.getenv().getOrDefault("EVENTONE_BLOCKCHAIN_RPCURL", "http://localhost:8545"));
        registry.add("blockchain.chain-id", () -> System.getenv().getOrDefault("EVENTONE_BLOCKCHAIN_CHAINID", "31337"));
        registry.add("blockchain.private-key", () -> System.getenv().getOrDefault("EVENTONE_BLOCKCHAIN_PRIVATEKEY", "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"));
        registry.add("blockchain.credential-contract", () -> System.getenv().getOrDefault("EVENTONE_CREDENTIAL_CONTRACT", "0xTBD"));
    }

    @Autowired
    private BlockchainActionService blockchainActionService;

    @Autowired
    private Web3Client web3Client;

    @Test
    void shouldIssueVerifyDuplicateAndRevokeCredentialOnLocalEvm() throws Exception {
        String credentialContractAddress = System.getenv().getOrDefault("EVENTONE_CREDENTIAL_CONTRACT", "0xTBD");
        assertThat(credentialContractAddress).isNotEqualTo("0xTBD");

        String attendeeAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        String eventId = "EVT_CRED_LOCAL_001";
        String credentialType = "ATTENDANCE";
        String metadataUri = "ipfs://eventone/credential/test-001";
        String credentialId = "cred-local-001";

        BlockchainResponse firstIssue = blockchainActionService.issueCredential(attendeeAddress, eventId, credentialType, metadataUri, credentialId);

        assertThat(firstIssue.getStatus()).isEqualTo("CONFIRMED");
        assertThat(firstIssue.getTransactionHash()).isNotBlank();
        assertThat(firstIssue.getTokenId()).isNotBlank();

        BigInteger tokenId = new BigInteger(firstIssue.getTokenId());
        String expectedEventHash = Hash.sha3String(eventId);
        String expectedTypeHash = Hash.sha3String(credentialType);

        String owner = callString(new Function(
                "ownerOf",
                List.of(new Uint256(tokenId)),
                List.of(new TypeReference<Address>() {})
        ));

        List<Type<?>> credentialDetails = callContract(new Function(
                "getCredentialDetails",
                List.of(new Uint256(tokenId)),
                List.of(
                        new TypeReference<Address>() {},
                        new TypeReference<Bytes32>() {},
                        new TypeReference<Bytes32>() {},
                        new TypeReference<Uint8>() {},
                        new TypeReference<Uint64>() {},
                        new TypeReference<Utf8String>() {}
                )
        ));

        TransactionReceipt issueReceipt = receiptFor(firstIssue.getTransactionHash());
        String issueTopic0 = EventEncoder.encode(new Event(
                "CredentialIssued",
                Arrays.asList(
                        new TypeReference<Uint256>(true) {},
                        new TypeReference<Bytes32>(true) {},
                        new TypeReference<Address>(true) {}
                )
        ));

        assertThat(owner).isEqualToIgnoringCase(attendeeAddress);
        assertThat(((Bytes32) credentialDetails.get(1)).getValue()).isEqualTo(Hash.sha3(eventId.getBytes(StandardCharsets.UTF_8)));
        assertThat(((Bytes32) credentialDetails.get(2)).getValue()).isEqualTo(Hash.sha3(credentialType.getBytes(StandardCharsets.UTF_8)));
        assertThat(((Uint8) credentialDetails.get(3)).getValue()).isEqualTo(BigInteger.ZERO);
        assertThat(((Utf8String) credentialDetails.get(5)).getValue()).isEqualTo(metadataUri);
        assertThat(issueReceipt.getLogs()).anyMatch(log -> issueTopic0.equals(log.getTopics().get(0)));
        assertThat(issueReceipt.getLogs())
                .filteredOn(log -> issueTopic0.equals(log.getTopics().get(0)))
                .first()
                .satisfies(log -> assertThat(log.getTopics().get(1)).isEqualTo(String.format("0x%064x", tokenId)));
        assertThat(expectedEventHash).isEqualTo(Hash.sha3String(eventId));
        assertThat(expectedTypeHash).isEqualTo(Hash.sha3String(credentialType));

        BlockchainResponse duplicateIssue = blockchainActionService.issueCredential(attendeeAddress, eventId, credentialType, metadataUri, credentialId);
        assertThat(duplicateIssue.getStatus()).isEqualTo("CONFIRMED");
        assertThat(duplicateIssue.getTokenId()).isEqualTo(firstIssue.getTokenId());
        assertThat(duplicateIssue.getTransactionHash()).isEqualTo(firstIssue.getTransactionHash());

        BlockchainResponse revoke = blockchainActionService.revokeCredential(firstIssue.getTokenId(), credentialId);
        assertThat(revoke.getStatus()).isEqualTo("CONFIRMED");
        assertThat(revoke.getTransactionHash()).isNotBlank();

        List<Type<?>> revokedDetails = callContract(new Function(
                "getCredentialDetails",
                List.of(new Uint256(tokenId)),
                List.of(
                        new TypeReference<Address>() {},
                        new TypeReference<Bytes32>() {},
                        new TypeReference<Bytes32>() {},
                        new TypeReference<Uint8>() {},
                        new TypeReference<Uint64>() {},
                        new TypeReference<Utf8String>() {}
                )
        ));

        TransactionReceipt revokeReceipt = receiptFor(revoke.getTransactionHash());
        String revokeTopic0 = EventEncoder.encode(new Event(
                "CredentialRevoked",
                List.of(new TypeReference<Uint256>(true) {})
        ));

        assertThat(((Uint8) revokedDetails.get(3)).getValue()).isEqualTo(BigInteger.ONE);
        assertThat(revokeReceipt.getLogs()).anyMatch(log -> revokeTopic0.equals(log.getTopics().get(0)));
    }

    private TransactionReceipt receiptFor(String transactionHash) throws Exception {
        return web3Client.getWeb3j().ethGetTransactionReceipt(transactionHash).send().getTransactionReceipt().orElseThrow();
    }

    private String callString(Function function) throws Exception {
        List<Type<?>> result = callContract(function);
        return Objects.toString(result.get(0).getValue(), null);
    }

    @SuppressWarnings("unchecked")
    private List<Type<?>> callContract(Function function) throws Exception {
        String encodedFunction = FunctionEncoder.encode(function);
        String rawResult = web3Client.getWeb3j()
                .ethCall(Transaction.createEthCallTransaction(null, System.getenv().getOrDefault("EVENTONE_CREDENTIAL_CONTRACT", "0xTBD"), encodedFunction), DefaultBlockParameterName.LATEST)
                .send()
                .getValue();
        return (List<Type<?>>) (List<?>) FunctionReturnDecoder.decode(rawResult, function.getOutputParameters());
    }
}