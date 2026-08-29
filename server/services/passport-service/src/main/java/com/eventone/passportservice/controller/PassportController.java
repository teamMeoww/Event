package com.eventone.passportservice.controller;

import com.eventone.passportservice.dto.PrivatePassportResponse;
import com.eventone.passportservice.dto.PublicPassportResponse;
import com.eventone.passportservice.service.PassportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/passport")
public class PassportController {

    private final PassportService passportService;

    public PassportController(PassportService passportService) {
        this.passportService = passportService;
    }

    @GetMapping("/me")
    public ResponseEntity<PrivatePassportResponse> getMyPassport(Authentication auth) {
        // Authenticated access via JWT Filter in SecurityContext
        String userId = auth.getName();
        return ResponseEntity.ok(passportService.getPrivatePassport(userId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<PublicPassportResponse> getPublicPassport(@PathVariable String userId) {
        return ResponseEntity.ok(passportService.getPublicPassport(userId));
    }
    
    @PostMapping("/{userId}/rebuild")
    public ResponseEntity<Void> rebuildPassport(@PathVariable String userId) {
        // Internal/Admin API
        passportService.rebuildPassport(userId);
        return ResponseEntity.ok().build();
    }
}
