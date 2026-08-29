package com.eventone.blockchainservice.service;

import com.eventone.blockchainservice.domain.BlockchainTransaction;
import com.eventone.blockchainservice.repository.BlockchainTransactionRepository;
import com.eventone.blockchainservice.dto.BlockchainResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.tx.response.PollingTransactionReceiptProcessor;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.core.methods.response.EthGetTransactionReceipt;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.TypeReference;

import jakarta.annotation.PostConstruct;
import java.net.SocketTimeoutException;
import java.time.Instant;
import java.util.Optional;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.Locale;

@Service
public class BlockchainActionService {

    private static final Event TICKET_MINTED_EVENT = new Event("TicketMinted", 
        Arrays.asList(
            new TypeReference<Uint256>(true) {}, 
            new TypeReference<Bytes32>(true) {}, 
            new TypeReference<Address>(true) {}
        )
    );

    private static final Event CREDENTIAL_ISSUED_EVENT = new Event("CredentialIssued", 
        Arrays.asList(
            new TypeReference<Uint256>(true) {}, 
            new TypeReference<Bytes32>(true) {}, 
            new TypeReference<Address>(true) {}
        )
    );


    private final Web3Client web3Client;
    private final BlockchainTransactionRepository transactionRepository;

    @Value("${blockchain.chain-id}")
    private String chainId;

    @Value("${blockchain.ticket-contract}")
    private String ticketContractAddress;

    @Value("${blockchain.credential-contract}")
    private String credentialContractAddress;

    private TransactionManager transactionManager;
    private DefaultGasProvider gasProvider;

    public BlockchainActionService(Web3Client web3Client, BlockchainTransactionRepository transactionRepository) {
        this.web3Client = web3Client;
        this.transactionRepository = transactionRepository;
    }

    @PostConstruct
    public void init() {
        // Fallback for chainId if it's "31337" or similar
        long parsedChainId = 1337;
        try {
            parsedChainId = Long.parseLong(chainId);
        } catch(Exception ignored) {}
        
        transactionManager = new RawTransactionManager(web3Client.getWeb3j(), web3Client.getCredentials(), parsedChainId);
        gasProvider = new DefaultGasProvider();
    }
    
    // Deterministic ID mapping
    private byte[] stringToBytes32(String string) {
        byte[] byteValue = string.getBytes();
        byte[] byteValueLen32 = new byte[32];
        System.arraycopy(byteValue, 0, byteValueLen32, 0, Math.min(byteValue.length, 32));
        return org.web3j.crypto.Hash.sha3(byteValue);
    }

    private boolean isTimeoutException(Exception e) {
        Throwable cause = e.getCause();
        while (cause != null) {
            if (cause instanceof SocketTimeoutException || cause.getClass().getSimpleName().equals("ClientConnectionException")) {
                return true;
            }
            cause = cause.getCause();
        }
        return e instanceof SocketTimeoutException || e.getClass().getSimpleName().equals("ClientConnectionException");
    }

    private String normalizeAddress(String attendeeAddress) {
        return attendeeAddress == null ? null : attendeeAddress.trim().toLowerCase(Locale.ROOT);
    }

    private String buildTicketEntityId(String attendeeAddress, String publicEventId) {
        return "TICKET_" + publicEventId + "_" + normalizeAddress(attendeeAddress);
    }

    private TransactionReceipt getReceiptIfAvailable(String transactionHash) {
        try {
            EthGetTransactionReceipt receiptResponse = web3Client.getWeb3j().ethGetTransactionReceipt(transactionHash).send();
            return receiptResponse.getTransactionReceipt().orElse(null);
        } catch (Exception ignored) {
            return null;
        }
    }

    private BlockchainResponse buildResponseFromReceipt(BlockchainTransaction tx, TransactionReceipt receipt, String entityId) {
        String extractedTokenId = null;
        if (receipt != null && receipt.isStatusOK()) {
            tx.setStatus("CONFIRMED");
            tx.setConfirmedAt(Instant.now());

            String ticketMintedTopic = EventEncoder.encode(TICKET_MINTED_EVENT);
            String credIssuedTopic = EventEncoder.encode(CREDENTIAL_ISSUED_EVENT);

            for (org.web3j.protocol.core.methods.response.Log log : receipt.getLogs()) {
                if (!log.getTopics().isEmpty()) {
                    String eventTopic = log.getTopics().get(0);
                    if (eventTopic.equals(ticketMintedTopic) || eventTopic.equals(credIssuedTopic)) {
                        if (log.getTopics().size() > 1) {
                            extractedTokenId = new BigInteger(log.getTopics().get(1).substring(2), 16).toString();
                            tx.setLastError("TokenID: " + extractedTokenId);
                            break;
                        }
                    }
                }
            }
        } else if (receipt != null) {
            tx.setStatus("REVERTED");
        } else {
            tx.setStatus("PENDING");
        }

        if (receipt != null) {
            tx.setBlockNumber(receipt.getBlockNumber().longValue());
        }

        transactionRepository.save(tx);
        return new BlockchainResponse(tx.getTransactionHash(), tx.getStatus(), entityId, extractedTokenId);
    }

    private TransactionReceipt executeFunction(String contractAddress, Function function) throws Exception {
        String encodedFunction = FunctionEncoder.encode(function);
        EthSendTransaction txResponse = transactionManager.sendTransaction(
                gasProvider.getGasPrice(function.getName()),
                gasProvider.getGasLimit(function.getName()),
                contractAddress,
                encodedFunction,
                BigInteger.ZERO
        );
        if (txResponse.hasError()) {
            throw new RuntimeException("Error sending tx: " + txResponse.getError().getMessage());
        }
        PollingTransactionReceiptProcessor processor = new PollingTransactionReceiptProcessor(web3Client.getWeb3j(), 1000, 30);
        return processor.waitForTransactionReceipt(txResponse.getTransactionHash());
    }

    public BlockchainResponse issueTicket(String attendeeAddress, String publicEventId) {
        return issueTicket(attendeeAddress, publicEventId, buildTicketEntityId(attendeeAddress, publicEventId));
    }

    public BlockchainResponse issueTicket(String attendeeAddress, String publicEventId, String issuanceKey) {
        String entityId = issuanceKey == null ? buildTicketEntityId(attendeeAddress, publicEventId) : issuanceKey;

        Optional<BlockchainTransaction> existingOpt = transactionRepository.findByEntityTypeAndEntityIdAndOperation("TICKET", entityId, "MINT");
        if (existingOpt.isPresent()) {
            BlockchainTransaction existing = existingOpt.get();
            if ("CONFIRMED".equals(existing.getStatus()) || "REVERTED".equals(existing.getStatus()) || "FAILED".equals(existing.getStatus())) {
                return new BlockchainResponse(existing.getTransactionHash(), existing.getStatus(), entityId, extractTokenIdFromTx(existing));
            }

            if (existing.getTransactionHash() != null) {
                TransactionReceipt receipt = getReceiptIfAvailable(existing.getTransactionHash());
                if (receipt != null) {
                    return buildResponseFromReceipt(existing, receipt, entityId);
                }

                return new BlockchainResponse(existing.getTransactionHash(), existing.getStatus(), entityId, extractTokenIdFromTx(existing));
            }
        }

        BlockchainTransaction tx = existingOpt.orElseGet(() -> {
            BlockchainTransaction created = new BlockchainTransaction();
            created.setEntityType("TICKET");
            created.setEntityId(entityId);
            created.setOperation("MINT");
            created.setChainId(chainId);
            created.setContractAddress(ticketContractAddress);
            created.setStatus("QUEUED");
            created.setSubmittedAt(Instant.now());
            return created;
        });

        if (tx.getId() == null) {
            try {
                tx = transactionRepository.save(tx);
            } catch (DuplicateKeyException e) {
                Optional<BlockchainTransaction> reloaded = transactionRepository.findByEntityTypeAndEntityIdAndOperation("TICKET", entityId, "MINT");
                if (reloaded.isPresent()) {
                    return issueTicket(attendeeAddress, publicEventId, entityId);
                }
                throw e;
            }
        }

        try {
            tx.setStatus("SUBMITTED");
            transactionRepository.save(tx);

            Function function = new Function(
                    "mintTicket",
                    Arrays.asList(new Address(attendeeAddress), new Bytes32(stringToBytes32(publicEventId))),
                    Collections.emptyList()
            );

            String encodedFunction = FunctionEncoder.encode(function);
            EthSendTransaction txResponse = transactionManager.sendTransaction(
                    gasProvider.getGasPrice(function.getName()),
                    gasProvider.getGasLimit(function.getName()),
                    ticketContractAddress,
                    encodedFunction,
                    BigInteger.ZERO
            );
            if (txResponse.hasError()) {
                throw new RuntimeException("Error sending tx: " + txResponse.getError().getMessage());
            }

            tx.setTransactionHash(txResponse.getTransactionHash());
            transactionRepository.save(tx);

            PollingTransactionReceiptProcessor processor = new PollingTransactionReceiptProcessor(web3Client.getWeb3j(), 1000, 30);
            TransactionReceipt receipt;
            try {
                receipt = processor.waitForTransactionReceipt(txResponse.getTransactionHash());
            } catch (Exception e) {
                if (isTimeoutException(e)) {
                    receipt = getReceiptIfAvailable(txResponse.getTransactionHash());
                } else {
                    throw e;
                }
            }

            if (receipt != null) {
                tx.setBlockNumber(receipt.getBlockNumber().longValue());
            }

            return buildResponseFromReceipt(tx, receipt, entityId);
        } catch (Exception e) {
            if (isTimeoutException(e)) {
                tx.setStatus("PENDING");
                transactionRepository.save(tx);
                return new BlockchainResponse(tx.getTransactionHash(), tx.getStatus(), entityId, extractTokenIdFromTx(tx));
            }

            tx.setStatus("FAILED");
            tx.setLastError(e.getMessage());
            transactionRepository.save(tx);
            return new BlockchainResponse(tx.getTransactionHash(), tx.getStatus(), entityId, extractTokenIdFromTx(tx));
        }
    }
    
    public BlockchainResponse revokeTicket(String tokenId) {
        String entityId = "REVOKE_TICKET_" + tokenId;
        
        Optional<BlockchainTransaction> existingOpt = transactionRepository.findByEntityTypeAndEntityIdAndOperation("TICKET", entityId, "REVOKE");
        if (existingOpt.isPresent() && !existingOpt.get().getStatus().equals("FAILED")) {
            return new BlockchainResponse(existingOpt.get().getTransactionHash(), existingOpt.get().getStatus(), entityId);
        }

        BlockchainTransaction tx = new BlockchainTransaction();
        tx.setEntityType("TICKET");
        tx.setEntityId(entityId);
        tx.setOperation("REVOKE");
        tx.setChainId(chainId);
        tx.setContractAddress(ticketContractAddress);
        tx.setStatus("QUEUED");
        tx.setSubmittedAt(Instant.now());
        tx = transactionRepository.save(tx);

        try {
            tx.setStatus("SUBMITTED");
            transactionRepository.save(tx);
            
            Function function = new Function(
                    "revoke", 
                    Arrays.asList(new Uint256(new BigInteger(tokenId))), 
                    Collections.emptyList()
            );
            
            TransactionReceipt receipt = executeFunction(ticketContractAddress, function);
            
            tx.setTransactionHash(receipt.getTransactionHash());
            tx.setBlockNumber(receipt.getBlockNumber().longValue());
            
            if (receipt.isStatusOK()) {
                tx.setStatus("CONFIRMED");
                tx.setConfirmedAt(Instant.now());
            } else {
                tx.setStatus("REVERTED");
            }
        } catch (Exception e) {
            if (isTimeoutException(e)) {
                tx.setStatus("PENDING");
            } else {
                tx.setStatus("FAILED");
                tx.setLastError(e.getMessage());
            }
        }
        
        transactionRepository.save(tx);
        return new BlockchainResponse(tx.getTransactionHash(), tx.getStatus(), entityId);
    }

    public BlockchainResponse issueCredential(String attendeeAddress, String publicEventId, String credentialType, String metadataUri, String credentialId) {
        String entityId = "CRED_" + publicEventId + "_" + attendeeAddress;
        
        Optional<BlockchainTransaction> existingOpt = transactionRepository.findByEntityTypeAndEntityIdAndOperation("CREDENTIAL", entityId, "MINT");
        if (existingOpt.isPresent() && !existingOpt.get().getStatus().equals("FAILED")) {
            return new BlockchainResponse(existingOpt.get().getTransactionHash(), existingOpt.get().getStatus(), entityId, extractTokenIdFromTx(existingOpt.get()));
        }

        BlockchainTransaction tx = new BlockchainTransaction();
        tx.setEntityType("CREDENTIAL");
        tx.setEntityId(entityId);
        tx.setOperation("MINT");
        tx.setChainId(chainId);
        tx.setContractAddress(credentialContractAddress);
        tx.setStatus("QUEUED");
        tx.setSubmittedAt(Instant.now());
        tx = transactionRepository.save(tx);

        String extractedTokenId = null;

        try {
            tx.setStatus("SUBMITTED");
            transactionRepository.save(tx);
            
            Function function = new Function(
                    "issueCredential", 
                    Arrays.asList(new Address(attendeeAddress), new Bytes32(stringToBytes32(publicEventId)), new Bytes32(stringToBytes32(credentialType)), new Utf8String(metadataUri)), 
                    Collections.emptyList()
            );
            
            TransactionReceipt receipt = executeFunction(credentialContractAddress, function);
            
            tx.setTransactionHash(receipt.getTransactionHash());
            tx.setBlockNumber(receipt.getBlockNumber().longValue());
            
            if (receipt.isStatusOK()) {
                tx.setStatus("CONFIRMED");
                tx.setConfirmedAt(Instant.now());
                
                if (!receipt.getLogs().isEmpty()) {
                    org.web3j.protocol.core.methods.response.Log log = receipt.getLogs().get(0);
                    if (log.getTopics().size() > 1) {
                        extractedTokenId = new BigInteger(log.getTopics().get(1).substring(2), 16).toString();
                        tx.setLastError("TokenID: " + extractedTokenId);
                    }
                }
            } else {
                tx.setStatus("REVERTED");
            }
        } catch (Exception e) {
            if (isTimeoutException(e)) {
                tx.setStatus("PENDING");
            } else {
                tx.setStatus("FAILED");
                tx.setLastError(e.getMessage());
            }
        }
        
        transactionRepository.save(tx);
        return new BlockchainResponse(tx.getTransactionHash(), tx.getStatus(), entityId, extractedTokenId);
    }
    
    public BlockchainResponse revokeCredential(String tokenId, String credentialId) {
        String entityId = "REVOKE_CRED_" + tokenId;
        
        Optional<BlockchainTransaction> existingOpt = transactionRepository.findByEntityTypeAndEntityIdAndOperation("CREDENTIAL", entityId, "REVOKE");
        if (existingOpt.isPresent() && !existingOpt.get().getStatus().equals("FAILED")) {
            return new BlockchainResponse(existingOpt.get().getTransactionHash(), existingOpt.get().getStatus(), entityId);
        }

        BlockchainTransaction tx = new BlockchainTransaction();
        tx.setEntityType("CREDENTIAL");
        tx.setEntityId(entityId);
        tx.setOperation("REVOKE");
        tx.setChainId(chainId);
        tx.setContractAddress(credentialContractAddress);
        tx.setStatus("QUEUED");
        tx.setSubmittedAt(Instant.now());
        tx = transactionRepository.save(tx);

        try {
            tx.setStatus("SUBMITTED");
            transactionRepository.save(tx);
            
            Function function = new Function(
                    "revokeCredential", 
                    Arrays.asList(new Uint256(new BigInteger(tokenId))), 
                    Collections.emptyList()
            );
            
            TransactionReceipt receipt = executeFunction(credentialContractAddress, function);
            
            tx.setTransactionHash(receipt.getTransactionHash());
            tx.setBlockNumber(receipt.getBlockNumber().longValue());
            
            if (receipt.isStatusOK()) {
                tx.setStatus("CONFIRMED");
                tx.setConfirmedAt(Instant.now());
            } else {
                tx.setStatus("REVERTED");
            }
        } catch (Exception e) {
            if (isTimeoutException(e)) {
                tx.setStatus("UNKNOWN");
            } else {
                tx.setStatus("FAILED");
                tx.setLastError(e.getMessage());
            }
        }
        
        transactionRepository.save(tx);
        return new BlockchainResponse(tx.getTransactionHash(), tx.getStatus(), entityId);
    }
    
    private String extractTokenIdFromTx(BlockchainTransaction tx) {
        if (tx.getLastError() != null && tx.getLastError().startsWith("TokenID: ")) {
            return tx.getLastError().replace("TokenID: ", "").trim();
        }
        return null;
    }
}
