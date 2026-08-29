package com.eventone.walletservice.dto;
import java.time.Instant;
public class ChallengeResponse {
    private String nonce;
    private String message;
    private Instant expiresAt;
    public ChallengeResponse(String nonce, String message, Instant expiresAt) {
        this.nonce = nonce; this.message = message; this.expiresAt = expiresAt;
    }
    public String getNonce() { return nonce; }
    public String getMessage() { return message; }
    public Instant getExpiresAt() { return expiresAt; }
}
