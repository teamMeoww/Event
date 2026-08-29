package com.eventone.walletservice.dto;
import jakarta.validation.constraints.NotBlank;
public class ChallengeRequest {
    @NotBlank
    private String address;
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
