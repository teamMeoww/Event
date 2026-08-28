package com.eventone.shared.dto;

import java.util.Map;

public class ErrorResponse {
    private boolean success;
    private ErrorDetails error;
    private String requestId;

    public ErrorResponse() {}
    public ErrorResponse(String code, String message, String requestId) {
        this.success = false;
        this.error = new ErrorDetails(code, message, null);
        this.requestId = requestId;
    }
    public ErrorResponse(String code, String message, Map<String, String> fields, String requestId) {
        this.success = false;
        this.error = new ErrorDetails(code, message, fields);
        this.requestId = requestId;
    }

    public static class ErrorDetails {
        private String code;
        private String message;
        private Map<String, String> fields;
        public ErrorDetails() {}
        public ErrorDetails(String code, String message, Map<String, String> fields) {
            this.code = code; this.message = message; this.fields = fields;
        }
        public String getCode() { return code; }
        public String getMessage() { return message; }
        public Map<String, String> getFields() { return fields; }
    }

    public boolean isSuccess() { return success; }
    public ErrorDetails getError() { return error; }
    public String getRequestId() { return requestId; }
}
