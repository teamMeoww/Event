package com.eventone.eventservice.controller;

import com.eventone.eventservice.domain.Event;
import com.eventone.eventservice.dto.EventRequest;
import com.eventone.eventservice.service.EventService;
import com.eventone.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ApiResponse<Event> createEvent(@Valid @RequestBody EventRequest request, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        Event event = eventService.createEvent(request, userId);
        return ApiResponse.success(event, UUID.randomUUID().toString());
    }

    @GetMapping
    public ApiResponse<Page<Event>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Event> events = eventService.getAllEvents(page, size);
        return ApiResponse.success(events, UUID.randomUUID().toString());
    }

    @GetMapping("/{id}")
    public ApiResponse<Event> getEvent(@PathVariable String id) {
        Event event = eventService.getEvent(id);
        return ApiResponse.success(event, UUID.randomUUID().toString());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ApiResponse<Event> updateEvent(@PathVariable String id, @Valid @RequestBody EventRequest request, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        Event event = eventService.updateEvent(id, request, userId);
        return ApiResponse.success(event, UUID.randomUUID().toString());
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ApiResponse<Event> publishEvent(@PathVariable String id, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        Event event = eventService.publishEvent(id, userId);
        return ApiResponse.success(event, UUID.randomUUID().toString());
    }

    @PostMapping("/{id}/register")
    public ApiResponse<Object> registerForEvent(@PathVariable String id, Authentication auth, jakarta.servlet.http.HttpServletRequest httpRequest, org.springframework.boot.web.client.RestTemplateBuilder restTemplateBuilder, @org.springframework.beans.factory.annotation.Value("${eventone.services.ticket:http://ticket-service:8083}") String ticketServiceUrl) {
        String userId = auth.getName();
        String jwtToken = httpRequest.getHeader("Authorization");
        Object ticketResponse = eventService.registerForEvent(id, userId, jwtToken, restTemplateBuilder, ticketServiceUrl);
        return ApiResponse.success(ticketResponse, UUID.randomUUID().toString());
    }
}
