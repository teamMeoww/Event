package com.eventone.ticketservice.controller;

import com.eventone.ticketservice.domain.Ticket;
import com.eventone.ticketservice.repository.TicketRepository;
import com.eventone.ticketservice.service.qr.QrGeneratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketRepository ticketRepository;
    private final QrGeneratorService qrGeneratorService;

    public TicketController(TicketRepository ticketRepository, QrGeneratorService qrGeneratorService) {
        this.ticketRepository = ticketRepository;
        this.qrGeneratorService = qrGeneratorService;
    }

    @GetMapping("/{ticketId}/qr")
    public ResponseEntity<?> getDynamicQr(@PathVariable String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket == null) {
            return ResponseEntity.notFound().build();
        }
        
        // TODO: In production, verify that the authenticated user owns this ticket.
        
        String token = qrGeneratorService.generateQrToken(ticket.getId(), ticket.getEventId());
        
        return ResponseEntity.ok(Map.of(
            "ticketId", ticket.getId(),
            "eventId", ticket.getEventId(),
            "token", token,
            "expiresAt", Instant.now().plusSeconds(60).toString()
        ));
    }
}
