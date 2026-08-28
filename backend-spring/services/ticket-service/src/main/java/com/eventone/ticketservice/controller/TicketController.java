package com.eventone.ticketservice.controller;

import com.eventone.ticketservice.domain.Ticket;
import com.eventone.ticketservice.dto.TicketCreationRequest;
import com.eventone.ticketservice.repository.TicketRepository;
import com.eventone.ticketservice.service.TicketService;
import com.eventone.ticketservice.service.qr.QrGeneratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketRepository ticketRepository;
    private final QrGeneratorService qrGeneratorService;
    private final TicketService ticketService;

    public TicketController(TicketRepository ticketRepository, QrGeneratorService qrGeneratorService, TicketService ticketService) {
        this.ticketRepository = ticketRepository;
        this.qrGeneratorService = qrGeneratorService;
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody TicketCreationRequest request) {
        Ticket createdTicket = ticketService.createTicket(request);
        return ResponseEntity.status(201).body(createdTicket);
    }

    @GetMapping("/{ticketId}/qr")
    public ResponseEntity<?> getDynamicQr(@PathVariable String ticketId) {
        java.util.Optional<Ticket> ticketOpt = ticketRepository.findById(Objects.requireNonNull(ticketId, "ticketId"));
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Ticket ticket = ticketOpt.get();
        
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
