package com.eventone.walletservice.dto;
import jakarta.validation.constraints.NotBlank;
public class VerifyRequest {
    @NotBlank private String address;
    @NotBlank private String signature;
    @NotBlank private String nonce;
    // Getters and Setters
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
    public String getNonce() { return nonce; }
    public void setNonce(String nonce) { this.nonce = nonce; }
}
