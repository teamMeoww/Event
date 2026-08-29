package com.eventone.shared.exceptions;

public class EventOneException extends RuntimeException {
    private final String code;
    
    public EventOneException(String code, String message) {
        super(message);
        this.code = code;
    }
    
    public String getCode() { return code; }
}
