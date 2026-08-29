package com.eventone.walletservice.controller;

import com.eventone.shared.dto.ApiResponse;
import com.eventone.walletservice.domain.Wallet;
import com.eventone.walletservice.domain.WalletChallenge;
import com.eventone.walletservice.dto.ChallengeRequest;
import com.eventone.walletservice.dto.ChallengeResponse;
import com.eventone.walletservice.dto.VerifyRequest;
import com.eventone.walletservice.dto.WalletResponse;
import com.eventone.walletservice.dto.WalletDisconnectedEvent;
import com.eventone.walletservice.repository.WalletRepository;
import com.eventone.walletservice.service.WalletChallengeService;
import com.eventone.walletservice.service.WalletVerificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/wallet")
public class WalletController {

    private final WalletChallengeService challengeService;
    private final WalletVerificationService verificationService;
    private final WalletRepository walletRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${wallet.challenge.ttl-seconds}")
    private Long ttlSeconds;

    public WalletController(WalletChallengeService challengeService,
                            WalletVerificationService verificationService,
                            WalletRepository walletRepository,
                            KafkaTemplate<String, Object> kafkaTemplate) {
        this.challengeService = challengeService;
        this.verificationService = verificationService;
        this.walletRepository = walletRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    private String getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName(); // JWT Subject is userId
    }

    @GetMapping
    public ResponseEntity<ApiResponse<WalletResponse>> getWallet() {
        String userId = getUserId();
        Optional<Wallet> walletOpt = walletRepository.findByUserId(userId);
        
        WalletResponse resp = new WalletResponse();
        if (walletOpt.isPresent() && walletOpt.get().isVerified()) {
            Wallet w = walletOpt.get();
            resp.setConnected(true);
            resp.setAddress(w.getAddress());
            resp.setChain(w.getChain());
            resp.setChainId(w.getChainId());
            resp.setWalletType(w.getWalletType());
            resp.setVerified(true);
        } else {
            resp.setConnected(false);
            resp.setVerified(false);
        }
        return ResponseEntity.ok(ApiResponse.success(resp, "Wallet status retrieved"));
    }

    @PostMapping("/challenge")
    public ResponseEntity<ApiResponse<ChallengeResponse>> createChallenge(@Valid @RequestBody ChallengeRequest request) {
        String userId = getUserId();
        WalletChallenge challenge = challengeService.createChallenge(userId, request.getAddress());
        String message = challengeService.generateCanonicalMessage(challenge);
        Instant expiresAt = challenge.getCreatedAt().plusSeconds(ttlSeconds);
        
        return ResponseEntity.ok(ApiResponse.success(new ChallengeResponse(challenge.getNonce(), message, expiresAt), "Challenge generated"));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Boolean>> verifyWallet(@Valid @RequestBody VerifyRequest request) {
        String userId = getUserId();
        verificationService.verifySignature(userId, request.getAddress(), request.getNonce(), request.getSignature());
        return ResponseEntity.ok(ApiResponse.success(true, "Wallet successfully verified"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Boolean>> disconnectWallet() {
        String userId = getUserId();
        walletRepository.findByUserId(userId).ifPresent(walletRepository::delete);
        
        WalletDisconnectedEvent event = new WalletDisconnectedEvent();
        event.setUserId(userId);
        event.setTimestamp(Instant.now());
        kafkaTemplate.send("wallet-events", userId, event);
        
        return ResponseEntity.ok(ApiResponse.success(true, "Wallet disconnected"));
    }
}
