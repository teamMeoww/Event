package com.eventone.verificationservice.controller;

import com.eventone.verificationservice.dto.PublicCredentialVerificationResponse;
import com.eventone.verificationservice.dto.PublicTicketVerificationResponse;
import com.eventone.verificationservice.service.VerificationOrchestrator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/verification")
public class PublicVerificationController {

    private final VerificationOrchestrator orchestrator;

    public PublicVerificationController(VerificationOrchestrator orchestrator) {
        this.orchestrator = orchestrator;
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<PublicTicketVerificationResponse> verifyTicket(@PathVariable String ticketId) {
        return ResponseEntity.ok(orchestrator.verifyTicket(ticketId));
    }

    @GetMapping("/credential/{credentialId}")
    public ResponseEntity<PublicCredentialVerificationResponse> verifyCredential(@PathVariable String credentialId) {
        return ResponseEntity.ok(orchestrator.verifyCredential(credentialId));
    }
}
