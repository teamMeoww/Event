package com.eventone.ticketservice.service.qr;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class QrGeneratorService {

    private final SecretKey key;
    private final long ttlSeconds;

    public QrGeneratorService(@Value("${eventone.qr.secret}") String secret,
                              @Value("${eventone.qr.ttl:60}") long ttlSeconds) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.ttlSeconds = ttlSeconds;
    }

    public String generateQrToken(String ticketId, String eventId) {
        Instant now = Instant.now();
        Instant exp = now.plus(ttlSeconds, ChronoUnit.SECONDS);
        String nonce = UUID.randomUUID().toString();

        return Jwts.builder()
                .subject(ticketId)
                .claim("eventId", eventId)
                .claim("nonce", nonce)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(key)
                .compact();
    }
}
