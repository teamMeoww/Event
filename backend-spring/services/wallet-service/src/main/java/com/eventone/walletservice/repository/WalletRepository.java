package com.eventone.walletservice.repository;

import com.eventone.walletservice.domain.Wallet;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface WalletRepository extends MongoRepository<Wallet, String> {
    Optional<Wallet> findByUserId(String userId);
    Optional<Wallet> findByAddressAndChainId(String address, String chainId);
}
