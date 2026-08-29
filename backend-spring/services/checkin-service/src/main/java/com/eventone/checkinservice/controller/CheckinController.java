package com.eventone.checkinservice.controller;

import com.eventone.checkinservice.dto.CheckInRequest;
import com.eventone.checkinservice.dto.CheckInResponse;
import com.eventone.checkinservice.service.CheckinService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/checkins")
public class CheckinController {

    private final CheckinService checkinService;

    public CheckinController(CheckinService checkinService) {
        this.checkinService = checkinService;
    }

    @PostMapping("/verify")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ORGANIZER') or hasRole('SCANNER')")
    public ResponseEntity<CheckInResponse> verify(@RequestBody CheckInRequest request) {
        return ResponseEntity.ok(checkinService.verifyQr(request));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ORGANIZER') or hasRole('SCANNER')")
    public ResponseEntity<CheckInResponse> checkIn(@RequestBody CheckInRequest request, org.springframework.security.core.Authentication auth) {
        String scannerId = auth.getName();
        CheckInResponse res = checkinService.performCheckIn(request, scannerId);
        if (!res.isSuccess()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }
}
