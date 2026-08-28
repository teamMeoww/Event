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
    public ResponseEntity<CheckInResponse> verify(@RequestBody CheckInRequest request) {
        return ResponseEntity.ok(checkinService.verifyQr(request));
    }

    @PostMapping
    public ResponseEntity<CheckInResponse> checkIn(@RequestBody CheckInRequest request) {
        // TODO: In production, extract scannerId from SecurityContextHolder
        String scannerId = "SCANNER_001";
        CheckInResponse res = checkinService.performCheckIn(request, scannerId);
        if (!res.isSuccess()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }
}
