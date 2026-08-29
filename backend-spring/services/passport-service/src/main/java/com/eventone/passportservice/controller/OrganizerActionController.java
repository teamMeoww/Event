package com.eventone.passportservice.controller;

import com.eventone.passportservice.dto.OrganizerAwardRequest;
import com.eventone.passportservice.dto.OrganizerContributionRequest;
import com.eventone.passportservice.service.PassportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/events/{eventId}")
public class OrganizerActionController {

    private final PassportService passportService;

    public OrganizerActionController(PassportService passportService) {
        this.passportService = passportService;
    }

    @PostMapping("/awards")
    public ResponseEntity<Void> grantAward(@PathVariable String eventId, @RequestBody OrganizerAwardRequest req) {
        // RBAC ensures only Event Organizer reaches here
        passportService.addAward(eventId, req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/contributions")
    public ResponseEntity<Void> verifyContribution(@PathVariable String eventId, @RequestBody OrganizerContributionRequest req) {
        // RBAC ensures only Event Organizer reaches here
        passportService.addContribution(eventId, req);
        return ResponseEntity.ok().build();
    }
}
