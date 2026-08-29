package com.eventone.ticketservice.dto;

public class TicketCreationRequest {
    private String eventId;
    private String userId;
    private String walletAddress;
    private Boolean blockchainEnabled;
    private Boolean hasVerifiedWallet;

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    public Boolean getBlockchainEnabled() {
        return blockchainEnabled;
    }

    public void setBlockchainEnabled(Boolean blockchainEnabled) {
        this.blockchainEnabled = blockchainEnabled;
    }

    public Boolean getHasVerifiedWallet() {
        return hasVerifiedWallet;
    }

    public void setHasVerifiedWallet(Boolean hasVerifiedWallet) {
        this.hasVerifiedWallet = hasVerifiedWallet;
    }
}