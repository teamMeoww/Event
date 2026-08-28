package com.eventone.authservice.consumer;

import com.eventone.authservice.domain.User;
import com.eventone.authservice.repository.UserRepository;
import com.eventone.authservice.dto.WalletVerifiedEvent;
import com.eventone.authservice.dto.WalletDisconnectedEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WalletEventConsumer {
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public WalletEventConsumer(UserRepository userRepository, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "wallet-events", groupId = "auth-service-group")
    public void consume(String message) {
        try {
            if (message.contains("WALLET_VERIFIED")) {
                WalletVerifiedEvent event = objectMapper.readValue(message, WalletVerifiedEvent.class);
                Optional<User> userOpt = userRepository.findById(event.getUserId());
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    user.setWalletAddress(event.getWalletAddress());
                    user.setWalletType("EXTERNAL");
                    user.setWalletVerified(true);
                    userRepository.save(user);
                }
            } else if (message.contains("WALLET_DISCONNECTED")) {
                WalletDisconnectedEvent event = objectMapper.readValue(message, WalletDisconnectedEvent.class);
                Optional<User> userOpt = userRepository.findById(event.getUserId());
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    user.setWalletAddress(null);
                    user.setWalletType(null);
                    user.setWalletVerified(false);
                    userRepository.save(user);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
