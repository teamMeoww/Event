package com.eventone.shared.dto;

public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String requestId;

    public ApiResponse() {}
    public ApiResponse(boolean success, T data, String requestId) {
        this.success = success;
        this.data = data;
        this.requestId = requestId;
    }

    public static <T> ApiResponse<T> success(T data, String requestId) {
        return new ApiResponse<>(true, data, requestId);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
}
