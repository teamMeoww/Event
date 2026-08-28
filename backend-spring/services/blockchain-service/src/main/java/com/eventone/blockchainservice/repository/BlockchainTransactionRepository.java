package com.eventone.blockchainservice.repository;

import com.eventone.blockchainservice.domain.BlockchainTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface BlockchainTransactionRepository extends MongoRepository<BlockchainTransaction, String> {
    Optional<BlockchainTransaction> findByEntityTypeAndEntityIdAndOperation(String entityType, String entityId, String operation);
    List<BlockchainTransaction> findByStatus(String status);
}
