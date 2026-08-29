package com.eventone.checkinservice.dto;
public class CheckInRequest {
    private String qrToken;
    private String eventId;
    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
}
