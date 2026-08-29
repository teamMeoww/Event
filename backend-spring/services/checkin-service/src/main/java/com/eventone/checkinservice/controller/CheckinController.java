package com.eventone.checkinservice.controller;

import com.eventone.checkinservice.dto.CheckInRequest;
import com.eventone.checkinservice.dto.CheckInResponse;
import com.eventone.checkinservice.service.CheckinService;
import com.eventone.checkinservice.service.SseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/checkins")
public class CheckinController {

    private final CheckinService checkinService;
    private final SseService sseService;

    public CheckinController(CheckinService checkinService, SseService sseService) {
        this.checkinService = checkinService;
        this.sseService = sseService;
    }

    @GetMapping("/stream/{eventId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public SseEmitter streamCheckins(@PathVariable String eventId) {
        return sseService.subscribe(eventId);
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
        
        // Broadcast the check-in event to the dashboard
        sseService.broadcastCheckin(request.getEventId(), "New check-in recorded");
        
        return ResponseEntity.ok(res);
    }
}
