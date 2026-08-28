package com.eventone.blockchainservice.service;

import com.eventone.blockchainservice.contract.EventOneTicket;
import com.eventone.blockchainservice.contract.EventOneCredential;
import com.eventone.blockchainservice.domain.BlockchainTransaction;
import com.eventone.blockchainservice.repository.BlockchainTransactionRepository;
import com.eventone.blockchainservice.dto.BlockchainResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.gas.DefaultGasProvider;

import jakarta.annotation.PostConstruct;
import java.time.Instant;
import java.util.Optional;

@Service
public class BlockchainActionService {

    private final Web3Client web3Client;
    private final BlockchainTransactionRepository transactionRepository;

    @Value("${blockchain.chain-id}")
    private String chainId;

    @Value("${blockchain.ticket-contract}")
    private String ticketContractAddress;

    @Value("${blockchain.credential-contract}")
    private String credentialContractAddress;

    private EventOneTicket ticketContract;
    private EventOneCredential credentialContract;

    public BlockchainActionService(Web3Client web3Client, BlockchainTransactionRepository transactionRepository) {
        this.web3Client = web3Client;
        this.transactionRepository = transactionRepository;
    }

    @PostConstruct
    public void initContracts() {
        if (!"0xTBD".equals(ticketContractAddress)) {
            ticketContract = EventOneTicket.load(ticketContractAddress, web3Client.getWeb3j(), web3Client.getCredentials(), new DefaultGasProvider());
        }
        if (!"0xTBD".equals(credentialContractAddress)) {
            credentialContract = EventOneCredential.load(credentialContractAddress, web3Client.getWeb3j(), web3Client.getCredentials(), new DefaultGasProvider());
        }
    }
    
    // Deterministic ID mapping (PROPOSED DECISION 1)
    private byte[] stringToBytes32(String string) {
        byte[] byteValue = string.getBytes();
        byte[] byteValueLen32 = new byte[32];
        System.arraycopy(byteValue, 0, byteValueLen32, 0, Math.min(byteValue.length, 32));
        // Simple hash could also be org.web3j.crypto.Hash.sha3(byteValue)
        return org.web3j.crypto.Hash.sha3(byteValue);
    }

    public BlockchainResponse issueTicket(String attendeeAddress, String publicEventId) {
        String entityId = "TICKET_" + publicEventId + "_" + attendeeAddress; // Unique identifier for tracking
        
        Optional<BlockchainTransaction> existingOpt = transactionRepository.findByEntityTypeAndEntityIdAndOperation("TICKET", entityId, "MINT");
        if (existingOpt.isPresent() && !existingOpt.get().getStatus().equals("FAILED")) {
            return new BlockchainResponse(existingOpt.get().getTransactionHash(), existingOpt.get().getStatus(), entityId);
        }

        BlockchainTransaction tx = new BlockchainTransaction();
        tx.setEntityType("TICKET");
        tx.setEntityId(entityId);
        tx.setOperation("MINT");
        tx.setChainId(chainId);
        tx.setContractAddress(ticketContractAddress);
        tx.setStatus("QUEUED");
        tx.setSubmittedAt(Instant.now());
        tx = transactionRepository.save(tx);

        try {
            // Asynchronous send for real implementation, blocking here for simplicity of Phase 4 scaffold
            tx.setStatus("SUBMITTED");
            transactionRepository.save(tx);
            
            TransactionReceipt receipt = ticketContract.mintTicket(attendeeAddress, stringToBytes32(publicEventId)).send();
            
            tx.setTransactionHash(receipt.getTransactionHash());
            tx.setBlockNumber(receipt.getBlockNumber().longValue());
            
            if (receipt.isStatusOK()) {
                tx.setStatus("CONFIRMED");
                tx.setConfirmedAt(Instant.now());
            } else {
                tx.setStatus("REVERTED");
            }
        } catch (Exception e) {
            tx.setStatus("FAILED");
            tx.setLastError(e.getMessage());
        }
        
        transactionRepository.save(tx);
        return new BlockchainResponse(tx.getTransactionHash(), tx.getStatus(), entityId);
    }
    
    public BlockchainResponse issueCredential(String attendeeAddress, String publicEventId, String credentialType, String metadataUri) {
        String entityId = "CRED_" + publicEventId + "_" + attendeeAddress;
        
        Optional<BlockchainTransaction> existingOpt = transactionRepository.findByEntityTypeAndEntityIdAndOperation("CREDENTIAL", entityId, "MINT");
        if (existingOpt.isPresent() && !existingOpt.get().getStatus().equals("FAILED")) {
            return new BlockchainResponse(existingOpt.get().getTransactionHash(), existingOpt.get().getStatus(), entityId);
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

        try {
            tx.setStatus("SUBMITTED");
            transactionRepository.save(tx);
            
            TransactionReceipt receipt = credentialContract.issueCredential(
                attendeeAddress, 
                stringToBytes32(publicEventId), 
                stringToBytes32(credentialType), 
                metadataUri
            ).send();
            
            tx.setTransactionHash(receipt.getTransactionHash());
            tx.setBlockNumber(receipt.getBlockNumber().longValue());
            
            if (receipt.isStatusOK()) {
                tx.setStatus("CONFIRMED");
                tx.setConfirmedAt(Instant.now());
            } else {
                tx.setStatus("REVERTED");
            }
        } catch (Exception e) {
            tx.setStatus("FAILED");
            tx.setLastError(e.getMessage());
        }
        
        transactionRepository.save(tx);
        return new BlockchainResponse(tx.getTransactionHash(), tx.getStatus(), entityId);
    }
}
