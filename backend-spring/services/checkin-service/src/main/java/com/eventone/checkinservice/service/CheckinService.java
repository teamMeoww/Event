package com.eventone.checkinservice.service;

import com.eventone.checkinservice.domain.CheckIn;
import com.eventone.checkinservice.dto.CheckInRequest;
import com.eventone.checkinservice.dto.CheckInResponse;
import com.eventone.checkinservice.outbox.OutboxEvent;
import com.eventone.checkinservice.outbox.OutboxRepository;
import com.eventone.checkinservice.repository.CheckInRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
public class CheckinService {

    private final CheckInRepository checkInRepository;
    private final OutboxRepository outboxRepository;
    private final MongoTemplate mongoTemplate;
    private final StringRedisTemplate redisTemplate;
    private final SecretKey key;

    public CheckinService(CheckInRepository checkInRepository,
                          OutboxRepository outboxRepository,
                          MongoTemplate mongoTemplate,
                          StringRedisTemplate redisTemplate,
                          @Value("${eventone.qr.secret:defaultSuperSecretKeyForQrGenerationThatIsAtLeast32Bytes}") String secret) {
        this.checkInRepository = checkInRepository;
        this.outboxRepository = outboxRepository;
        this.mongoTemplate = mongoTemplate;
        this.redisTemplate = redisTemplate;
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public CheckInResponse verifyQr(CheckInRequest request) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(request.getQrToken())
                    .getPayload();

            String tokenEventId = claims.get("eventId", String.class);
            if (!request.getEventId().equals(tokenEventId)) {
                return new CheckInResponse(false, "WRONG_EVENT", "Ticket is for a different event.");
            }

            String nonce = claims.get("nonce", String.class);
            Boolean hasKey = redisTemplate.hasKey("qr_used:" + nonce);
            if (Boolean.TRUE.equals(hasKey)) {
                return new CheckInResponse(false, "ALREADY_USED", "QR code has already been used.");
            }
            
            // Check ticket status in mongo
            String ticketId = claims.getSubject();
            Query q = new Query(Criteria.where("_id").is(ticketId));
            @SuppressWarnings("unchecked")
            Map<String, Object> ticket = mongoTemplate.findOne(q, Map.class, "tickets");
            if (ticket == null) {
                return new CheckInResponse(false, "INVALID", "Ticket not found");
            }
            String status = (String) ticket.get("status");
            if ("CANCELLED".equals(status)) {
                return new CheckInResponse(false, "CANCELLED", "Ticket is cancelled");
            }
            if ("CHECKED_IN".equals(status)) {
                return new CheckInResponse(false, "ALREADY_USED", "Ticket is already checked in");
            }

            return new CheckInResponse(true, "VALID", "QR is valid.");

        } catch (ExpiredJwtException e) {
            return new CheckInResponse(false, "EXPIRED", "QR code has expired.");
        } catch (JwtException | IllegalArgumentException e) {
            return new CheckInResponse(false, "INVALID", "QR code signature is invalid or tampered.");
        }
    }

    @Transactional
    public CheckInResponse performCheckIn(CheckInRequest request, String scannerId) {
        CheckInResponse verifyRes = verifyQr(request);
        if (!verifyRes.isSuccess()) {
            return verifyRes;
        }

        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(request.getQrToken()).getPayload();
        String ticketId = claims.getSubject();
        String nonce = claims.get("nonce", String.class);

        // Replay protection via Redis
        Boolean set = redisTemplate.opsForValue().setIfAbsent("qr_used:" + nonce, "true", Objects.requireNonNull(Duration.ofMinutes(5), "replayTtl"));
        if (Boolean.FALSE.equals(set)) {
            return new CheckInResponse(false, "ALREADY_USED", "QR token replay detected.");
        }

        // Atomic DB Transition
        Query q = new Query(Criteria.where("_id").is(ticketId).and("status").is("ACTIVE"));
        Update u = new Update().set("status", "CHECKED_IN").set("used", true).set("usedAt", Instant.now());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> updatedTicket = mongoTemplate.findAndModify(q, u, FindAndModifyOptions.options().returnNew(true), Map.class, "tickets");
        if (updatedTicket == null) {
            return new CheckInResponse(false, "ALREADY_USED", "Ticket was already checked in concurrently.");
        }

        // Create CheckIn
        CheckIn checkIn = new CheckIn();
        checkIn.setId(UUID.randomUUID().toString());
        checkIn.setTicketId(ticketId);
        checkIn.setEventId(request.getEventId());
        checkIn.setUserId((String) updatedTicket.get("userId"));
        checkIn.setVerificationMethod("QR");
        checkIn.setVerificationStatus("VERIFIED");
        checkIn.setBlockchainStatus("NOT_STARTED");
        checkIn.setCheckedInAt(Instant.now());
        checkIn.setScannerId(scannerId);
        checkInRepository.save(checkIn);

        // Outbox Event
        OutboxEvent event = new OutboxEvent();
        event.setAggregateType("CheckIn");
        event.setAggregateId(checkIn.getId());
        event.setEventType("CHECKIN_COMPLETED");
        event.setStatus("PENDING");
        event.setCreatedAt(Instant.now());
        
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventId", checkIn.getEventId());
        payload.put("ticketId", checkIn.getTicketId());
        payload.put("userId", checkIn.getUserId());
        payload.put("checkInId", checkIn.getId());
        payload.put("checkedInAt", checkIn.getCheckedInAt().toString());
        payload.put("verificationMethod", "QR");
        payload.put("walletAddress", updatedTicket.get("walletAddress"));
        payload.put("blockchainEnabled", updatedTicket.get("blockchainEnabled"));
        event.setPayload(payload);
        
        outboxRepository.save(event);

        return new CheckInResponse(true, "SUCCESS", "Check-in completed successfully.");
    }
}
