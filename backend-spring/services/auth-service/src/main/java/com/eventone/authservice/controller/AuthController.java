package com.eventone.authservice.controller;

import com.eventone.authservice.dto.AuthRequest;
import com.eventone.authservice.service.AuthService;
import com.eventone.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<Map<String, Object>> register(@Valid @RequestBody AuthRequest.Register request) {
        Map<String, Object> data = authService.register(request);
        return ApiResponse.success(data, UUID.randomUUID().toString());
    }

    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@Valid @RequestBody AuthRequest.Login request) {
        Map<String, Object> data = authService.login(request);
        return ApiResponse.success(data, UUID.randomUUID().toString());
    }
    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> getMe(org.springframework.security.core.Authentication auth) {
        String userId = auth.getName();
        Map<String, Object> data = authService.getMe(userId);
        return ApiResponse.success(data, UUID.randomUUID().toString());
    }
}
