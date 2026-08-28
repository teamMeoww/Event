package com.eventone.authservice.service;

import com.eventone.authservice.domain.User;
import com.eventone.authservice.dto.AuthRequest;
import com.eventone.authservice.repository.UserRepository;
import com.eventone.shared.enums.Role;
import com.eventone.shared.exceptions.EventOneException;
import com.eventone.shared.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public Map<String, Object> register(AuthRequest.Register request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new EventOneException("EMAIL_IN_USE", "Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRoles(List.of(Role.ATTENDEE));
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setReputationScore(0);

        user = userRepository.save(user);

        return login(user);
    }

    public Map<String, Object> login(AuthRequest.Login request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new EventOneException("INVALID_CREDENTIALS", "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new EventOneException("INVALID_CREDENTIALS", "Invalid email or password");
        }

        return login(user);
    }

    private Map<String, Object> login(User user) {
        List<String> roleStrings = user.getRoles().stream().map(Enum::name).collect(Collectors.toList());
        String token = jwtTokenProvider.generateToken(user.getId(), roleStrings);
        return Map.of(
                "accessToken", token,
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "roles", user.getRoles()
                )
        );
    }
}
