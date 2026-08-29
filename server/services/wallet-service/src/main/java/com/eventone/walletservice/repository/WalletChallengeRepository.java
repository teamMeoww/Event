package com.eventone.walletservice.repository;

import com.eventone.walletservice.domain.WalletChallenge;
import org.springframework.data.repository.CrudRepository;

public interface WalletChallengeRepository extends CrudRepository<WalletChallenge, String> {
}
