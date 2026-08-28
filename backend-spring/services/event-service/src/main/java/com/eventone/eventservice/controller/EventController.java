package com.eventone.eventservice.controller;

import com.eventone.eventservice.domain.Event;
import com.eventone.eventservice.dto.EventRequest;
import com.eventone.eventservice.service.EventService;
import com.eventone.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
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
    public ApiResponse<Event> updateEvent(@PathVariable String id, @Valid @RequestBody EventRequest request, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        Event event = eventService.updateEvent(id, request, userId);
        return ApiResponse.success(event, UUID.randomUUID().toString());
    }

    @PostMapping("/{id}/publish")
    public ApiResponse<Event> publishEvent(@PathVariable String id, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        Event event = eventService.publishEvent(id, userId);
        return ApiResponse.success(event, UUID.randomUUID().toString());
    }
}
