package com.eventone.verificationservice.dto;

public class PublicTicketVerificationResponse {
    private String type = "TICKET";
    private String ticketId;
    private EventInfo event;
    private String status;
    private BlockchainInfo blockchain;
    
    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }
    public EventInfo getEvent() { return event; }
    public void setEvent(EventInfo event) { this.event = event; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BlockchainInfo getBlockchain() { return blockchain; }
    public void setBlockchain(BlockchainInfo blockchain) { this.blockchain = blockchain; }
}
