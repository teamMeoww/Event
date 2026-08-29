package com.eventone.walletservice.service;

import com.eventone.walletservice.domain.WalletChallenge;
import com.eventone.walletservice.repository.WalletChallengeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;
import java.util.Optional;

@Service
public class WalletChallengeService {
    
    private final WalletChallengeRepository repository;
    
    @Value("${wallet.challenge.ttl-seconds}")
    private Long ttlSeconds;

    public WalletChallengeService(WalletChallengeRepository repository) {
        this.repository = repository;
    }

    public WalletChallenge createChallenge(String userId, String address) {
        String nonce = UUID.randomUUID().toString().replace("-", "");
        WalletChallenge challenge = new WalletChallenge();
        challenge.setNonce(nonce);
        challenge.setUserId(userId);
        challenge.setAddress(address.toLowerCase());
        challenge.setPurpose("Verify ownership of this wallet for EventOne.");
        challenge.setCreatedAt(Instant.now());
        challenge.setTimeToLive(ttlSeconds);
        return repository.save(challenge);
    }

    public String generateCanonicalMessage(WalletChallenge challenge) {
        Instant expiresAt = challenge.getCreatedAt().plusSeconds(ttlSeconds);
        return String.format(
            "EventOne Wallet Verification\n\nAddress: %s\nNonce: %s\nIssued At: %s\nExpiration: %s\nPurpose: %s",
            challenge.getAddress(),
            challenge.getNonce(),
            challenge.getCreatedAt().toString(),
            expiresAt.toString(),
            challenge.getPurpose()
        );
    }

    public Optional<WalletChallenge> getChallenge(String nonce) {
        return repository.findById(nonce);
    }
    
    public void deleteChallenge(String nonce) {
        repository.deleteById(nonce);
    }
}
