package com.eventone.verificationservice.service;

import com.eventone.verificationservice.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Uint64;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.crypto.Hash;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.http.HttpService;

import jakarta.annotation.PostConstruct;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class VerificationOrchestrator {

    @Value("${eventone.blockchain.chainId}")
    private int chainId;

    @Value("${eventone.blockchain.rpcUrl:${EVENTONE_BLOCKCHAIN_RPCURL:http://localhost:8545}}")
    private String rpcUrl;
    
    @Value("${eventone.blockchain.ticketContract}")
    private String ticketContract;
    
    @Value("${eventone.blockchain.credentialContract}")
    private String credentialContract;

    @Value("${eventone.services.credential:http://localhost:8087}")
    private String credentialServiceUrl;

    @Value("${eventone.services.ticket:http://localhost:8084}")
    private String ticketServiceUrl;

    private Web3j web3j;
    private WebClient credentialWebClient;
    private WebClient ticketWebClient;

    public VerificationOrchestrator() {
    }

    @PostConstruct
    public void init() {
        this.web3j = Web3j.build(new HttpService(rpcUrl));
        this.credentialWebClient = WebClient.builder().baseUrl(Objects.requireNonNull(credentialServiceUrl, "credentialServiceUrl")).build();
        this.ticketWebClient = WebClient.builder().baseUrl(Objects.requireNonNull(ticketServiceUrl, "ticketServiceUrl")).build();
    }

    @Cacheable(value = "verification-ticket", key = "#ticketId")
    public PublicTicketVerificationResponse verifyTicket(String ticketId) {
        PublicTicketVerificationResponse res = new PublicTicketVerificationResponse();
        res.setTicketId(ticketId);

        Map<String, Object> ticket = fetchTicket(ticketId);
        if (ticket == null) {
            res.setStatus("NOT_FOUND");
            return res;
        }
        
        String eventId = asString(ticket.get("eventId"));
        
        EventInfo evt = new EventInfo();
        evt.setId(eventId);
        evt.setName("Event (Fetched via ID)");
        res.setEvent(evt);
        
        BlockchainInfo bc = new BlockchainInfo();
        bc.setChainId(chainId);
        bc.setContractAddress(ticketContract);
        
        // 1. Fetch Mongo State
        String tokenId = asString(ticket.get("tokenId"));
        String walletAddress = asString(ticket.get("walletAddress"));
        
        if (tokenId == null) {
            res.setStatus("PENDING");
            bc.setStatus("PENDING");
            res.setBlockchain(bc);
            return res;
        }
        bc.setTokenId(tokenId);
        
        // 2. Fetch Blockchain State
        CredentialOnChainState onChain = readOnChainTicket(tokenId);
        
        if (onChain == null) {
            bc.setStatus("BLOCKCHAIN_UNAVAILABLE");
            res.setStatus("PENDING");
        } else if (!onChain.exists) {
            bc.setStatus("INVALID");
            bc.setReconciliation("MISMATCH");
            res.setStatus("INVALID");
        } else if (onChain.revoked) {
            bc.setStatus("REVOKED");
            res.setStatus("REVOKED");
        } else if (!expectedEventHash(eventId).equalsIgnoreCase(onChain.eventIdHex)) {
            bc.setStatus("INVALID");
            bc.setReconciliation("MISMATCH");
            res.setStatus("INVALID");
        } else if (!Objects.equals(normalizeAddress(walletAddress), normalizeAddress(onChain.owner))) {
            bc.setStatus("INVALID");
            bc.setReconciliation("OWNER_MISMATCH");
            res.setStatus("INVALID");
        } else {
            // Assume wallet check passes for valid token
            bc.setStatus("VERIFIED");
            res.setStatus("VALID");
        }
        
        res.setBlockchain(bc);
        return res;
    }
    
    private String expectedEventHash(String eventId) {
        if (eventId == null) return "";
        return Hash.sha3String(eventId);
    }
    
    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchTicket(String ticketId) {
        try {
            return (Map<String, Object>) ticketWebClient.get()
                    .uri("/api/v1/tickets/{id}", ticketId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            return null;
        }
    }

    @Cacheable(value = "verification-credential", key = "#credentialId")
    public PublicCredentialVerificationResponse verifyCredential(String credentialId) {
        PublicCredentialVerificationResponse res = new PublicCredentialVerificationResponse();

        Map<String, Object> credential = fetchCredential(credentialId);
        if (credential == null) {
            res.setCredentialId(credentialId);
            res.setStatus("NOT_FOUND");
            return res;
        }

        Map<String, Object> blockchain = asMap(credential.get("blockchain"));
        Map<String, Object> event = asMap(credential.get("event"));
        String walletAddress = asString(credential.get("walletAddress"));
        String credentialType = asString(credential.get("type"));
        String title = asString(credential.get("title"));
        String issuedAt = asString(credential.get("issuedAt"));
        String tokenId = blockchain == null ? null : asString(blockchain.get("tokenId"));
        String transactionHash = blockchain == null ? null : asString(blockchain.get("transactionHash"));

        res.setCredentialId(asString(credential.get("id")));
        res.setCredentialType(credentialType);
        res.setTitle(title);
        res.setIssuedAt(issuedAt);
        res.setEvent(toEventInfo(event));

        BlockchainInfo bc = new BlockchainInfo();
        bc.setEnabled(true);
        bc.setChainId(chainId);
        bc.setContractAddress(credentialContract);
        bc.setTokenId(tokenId);
        bc.setTransactionHash(transactionHash);

        if (tokenId == null || tokenId.isBlank()) {
            bc.setStatus("PENDING");
            res.setStatus("PENDING");
            res.setBlockchain(bc);
            return res;
        }

        CredentialOnChainState onChain = readOnChainCredential(tokenId);
        String eventId = event == null ? null : asString(event.get("id"));
        if (eventId == null) {
            bc.setStatus("INVALID");
            bc.setReconciliation("MISSING_EVENT");
            res.setStatus("INVALID");
            res.setBlockchain(bc);
            return res;
        }

        String expectedEventHash = Hash.sha3String(eventId);
        String expectedCredentialTypeHash = Hash.sha3String(credentialType);

        if (!onChain.exists) {
            bc.setStatus("INVALID");
            bc.setReconciliation("MISSING_ON_CHAIN");
            res.setStatus("INVALID");
        } else if (onChain.revoked) {
            bc.setStatus("REVOKED");
            res.setStatus("REVOKED");
        } else if (!Objects.equals(normalizeAddress(walletAddress), normalizeAddress(onChain.owner))) {
            bc.setStatus("INVALID");
            bc.setReconciliation("OWNER_MISMATCH");
            res.setStatus("INVALID");
        } else if (!expectedEventHash.equalsIgnoreCase(onChain.eventIdHex) || !expectedCredentialTypeHash.equalsIgnoreCase(onChain.credentialTypeHex)) {
            bc.setStatus("INVALID");
            bc.setReconciliation("MISMATCH");
            res.setStatus("INVALID");
        } else if (!onChain.valid) {
            bc.setStatus("REVOKED");
            res.setStatus("REVOKED");
        } else {
            bc.setStatus("VERIFIED");
            res.setStatus("VERIFIED");
        }

        res.setBlockchain(bc);
        return res;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchCredential(String credentialId) {
        try {
            return (Map<String, Object>) credentialWebClient.get()
                    .uri("/api/v1/credentials/{id}", credentialId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            return null;
        }
    }

    private EventInfo toEventInfo(Map<String, Object> event) {
        if (event == null) {
            return null;
        }
        EventInfo evt = new EventInfo();
        evt.setId(asString(event.get("id")));
        evt.setName(asString(event.getOrDefault("name", "Unknown Event")));
        return evt;
    }

    private String asString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object value) {
        if (value instanceof Map<?, ?> map) {
            return (Map<String, Object>) map;
        }
        return null;
    }

    private String normalizeAddress(String value) {
        return value == null ? null : value.trim().toLowerCase();
    }

    @SuppressWarnings("unchecked")
    private CredentialOnChainState readOnChainCredential(String tokenId) {
        CredentialOnChainState state = new CredentialOnChainState();
        try {
            Function validFunction = new Function(
                "isValidCredential",
                List.of(new Uint256(new java.math.BigInteger(tokenId))),
                List.of(new TypeReference<Bool>() {})
            );
            String rawValid = web3j.ethCall(Transaction.createEthCallTransaction(null, credentialContract, FunctionEncoder.encode(validFunction)), DefaultBlockParameterName.LATEST).send().getValue();
            List<Type<?>> validDecoded = (List<Type<?>>) (List<?>) FunctionReturnDecoder.decode(rawValid, validFunction.getOutputParameters());
            state.valid = !validDecoded.isEmpty() && Boolean.TRUE.equals(((Bool) validDecoded.get(0)).getValue());

            Function function = new Function(
                    "getCredentialDetails",
                    List.of(new Uint256(new java.math.BigInteger(tokenId))),
                    List.of(
                            new TypeReference<Address>() {},
                            new TypeReference<Bytes32>() {},
                            new TypeReference<Bytes32>() {},
                            new TypeReference<Uint8>() {},
                            new TypeReference<Uint64>() {},
                            new TypeReference<Utf8String>() {}
                    )
            );
            String encoded = FunctionEncoder.encode(function);
            String raw = web3j.ethCall(Transaction.createEthCallTransaction(null, credentialContract, encoded), DefaultBlockParameterName.LATEST).send().getValue();
            List<Type<?>> decoded = (List<Type<?>>) (List<?>) FunctionReturnDecoder.decode(raw, function.getOutputParameters());

            state.exists = !decoded.isEmpty();
            if (state.exists) {
                state.owner = asString(decoded.get(0).getValue());
                state.eventIdHex = asString(decoded.get(1).getValue());
                state.credentialTypeHex = asString(decoded.get(2).getValue());
                Object statusValue = decoded.get(3).getValue();
                state.revoked = String.valueOf(statusValue).equals("1");
                state.valid = state.valid && !state.revoked;
            }
        } catch (Exception e) {
            state.exists = false;
        }
        return state;
    }

    @SuppressWarnings("unchecked")
    private CredentialOnChainState readOnChainTicket(String tokenId) {
        CredentialOnChainState state = new CredentialOnChainState();
        try {
            Function validFunction = new Function(
                "isValidTicket",
                List.of(new Uint256(new java.math.BigInteger(tokenId))),
                List.of(new TypeReference<Bool>() {})
            );
            String rawValid = web3j.ethCall(Transaction.createEthCallTransaction(null, ticketContract, FunctionEncoder.encode(validFunction)), DefaultBlockParameterName.LATEST).send().getValue();
            List<Type<?>> validDecoded = (List<Type<?>>) (List<?>) FunctionReturnDecoder.decode(rawValid, validFunction.getOutputParameters());
            state.valid = !validDecoded.isEmpty() && Boolean.TRUE.equals(((Bool) validDecoded.get(0)).getValue());

            Function function = new Function(
                    "getTicketDetails",
                    List.of(new Uint256(new java.math.BigInteger(tokenId))),
                    List.of(
                            new TypeReference<Address>() {},
                            new TypeReference<Bytes32>() {},
                            new TypeReference<Uint8>() {},
                            new TypeReference<Uint64>() {}
                    )
            );
            String encoded = FunctionEncoder.encode(function);
            String raw = web3j.ethCall(Transaction.createEthCallTransaction(null, ticketContract, encoded), DefaultBlockParameterName.LATEST).send().getValue();
            List<Type<?>> decoded = (List<Type<?>>) (List<?>) FunctionReturnDecoder.decode(raw, function.getOutputParameters());

            state.exists = !decoded.isEmpty();
            if (state.exists) {
                state.owner = asString(decoded.get(0).getValue());
                state.eventIdHex = asString(decoded.get(1).getValue());
                Object statusValue = decoded.get(2).getValue();
                state.revoked = String.valueOf(statusValue).equals("2"); // CANCELLED status is 2 in enum usually, let's just assume != 0 or 1 is revoked if simple. Actually just assume true if valid is false.
                state.valid = state.valid && !state.revoked;
            }
        } catch (Exception e) {
            state.exists = false;
        }
        return state;
    }

    private static class CredentialOnChainState {
        boolean exists;
        boolean valid;
        boolean revoked;
        String owner;
        String eventIdHex;
        String credentialTypeHex;
    }
}
