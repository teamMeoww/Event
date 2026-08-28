package com.eventone.walletservice.service;

import com.eventone.walletservice.domain.Wallet;
import com.eventone.walletservice.domain.WalletChallenge;
import com.eventone.walletservice.repository.WalletRepository;
import com.eventone.walletservice.dto.WalletVerifiedEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;
import java.math.BigInteger;

import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;

@Service
public class WalletVerificationService {
    private final WalletChallengeService challengeService;
    private final WalletRepository walletRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${wallet.challenge.chain-id}")
    private String chainId;
    
    @Value("${wallet.challenge.chain-name}")
    private String chainName;

    public WalletVerificationService(WalletChallengeService challengeService, 
                                     WalletRepository walletRepository,
                                     KafkaTemplate<String, Object> kafkaTemplate) {
        this.challengeService = challengeService;
        this.walletRepository = walletRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public boolean verifySignature(String userId, String requestedAddress, String nonce, String signatureHex) {
        Optional<WalletChallenge> challengeOpt = challengeService.getChallenge(nonce);
        if (challengeOpt.isEmpty()) {
            throw new RuntimeException("WALLET_CHALLENGE_NOT_FOUND_OR_EXPIRED");
        }
        WalletChallenge challenge = challengeOpt.get();

        if (!challenge.getUserId().equals(userId)) {
            throw new RuntimeException("WALLET_ADDRESS_MISMATCH"); // Actually wrong user
        }
        
        if (!challenge.getAddress().equalsIgnoreCase(requestedAddress)) {
            throw new RuntimeException("WALLET_ADDRESS_MISMATCH");
        }

        String message = challengeService.generateCanonicalMessage(challenge);
        String recoveredAddress;

        try {
            byte[] msgHash = Sign.getEthereumMessageHash(message.getBytes());
            byte[] signatureBytes = Numeric.hexStringToByteArray(signatureHex);
            
            byte v = signatureBytes[64];
            if (v < 27) {
                v += 27;
            }
            byte[] r = Arrays.copyOfRange(signatureBytes, 0, 32);
            byte[] s = Arrays.copyOfRange(signatureBytes, 32, 64);

            Sign.SignatureData sd = new Sign.SignatureData(v, r, s);
            
            BigInteger pubKey = Sign.signedMessageHashToKey(msgHash, sd);
            recoveredAddress = "0x" + Keys.getAddress(pubKey);
        } catch (Exception e) {
            throw new RuntimeException("WALLET_SIGNATURE_INVALID");
        }

        if (!recoveredAddress.equalsIgnoreCase(requestedAddress)) {
            throw new RuntimeException("WALLET_SIGNATURE_INVALID");
        }

        // Signature valid, nonce single-use
        challengeService.deleteChallenge(nonce);

        // Save wallet
        Wallet wallet = walletRepository.findByUserId(userId).orElse(new Wallet());
        wallet.setUserId(userId);
        wallet.setAddress(recoveredAddress.toLowerCase());
        wallet.setChain(chainName);
        wallet.setChainId(chainId);
        wallet.setWalletType("EXTERNAL");
        wallet.setVerified(true);
        if (wallet.getCreatedAt() == null) {
            wallet.setCreatedAt(Instant.now());
        }
        wallet.setVerifiedAt(Instant.now());
        walletRepository.save(wallet);

        // Emit Event
        WalletVerifiedEvent event = new WalletVerifiedEvent();
        event.setUserId(userId);
        event.setWalletAddress(recoveredAddress.toLowerCase());
        event.setChainId(chainId);
        event.setTimestamp(Instant.now());
        kafkaTemplate.send("wallet-events", userId, event);

        return true;
    }
}
