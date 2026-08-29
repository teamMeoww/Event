package com.eventone.checkinservice.dto;
public class CheckInResponse {
    private boolean success;
    private String code;
    private String message;
    public CheckInResponse(boolean success, String code, String message) {
        this.success = success; this.code = code; this.message = message;
    }
    public boolean isSuccess() { return success; }
    public String getCode() { return code; }
    public String getMessage() { return message; }
}
