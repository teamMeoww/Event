package com.eventone.eventservice.service;

import com.eventone.eventservice.domain.Event;
import com.eventone.eventservice.domain.EventStatus;
import com.eventone.eventservice.dto.EventRequest;
import com.eventone.eventservice.repository.EventRepository;
import com.eventone.shared.exceptions.EventOneException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event createEvent(EventRequest request, String organizerId) {
        if (request.getEndAt().isBefore(request.getStartAt())) {
            throw new EventOneException("INVALID_DATES", "endAt cannot be before startAt");
        }

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setLocation(request.getLocation());
        event.setStartAt(request.getStartAt());
        event.setEndAt(request.getEndAt());
        event.setCapacity(request.getCapacity());
        event.setOrganizerId(organizerId);
        event.setStatus(EventStatus.DRAFT);
        event.setRegisteredCount(0);
        event.setCreatedAt(Instant.now());
        event.setUpdatedAt(Instant.now());

        return eventRepository.save(event);
    }

    public Page<Event> getAllEvents(int page, int size) {
        return eventRepository.findAll(PageRequest.of(page, size));
    }

    public Event getEvent(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new EventOneException("NOT_FOUND", "Event not found"));
    }

    public Event updateEvent(String id, EventRequest request, String userId) {
        Event event = getEvent(id);
        verifyOwnership(event, userId);

        if (request.getEndAt().isBefore(request.getStartAt())) {
            throw new EventOneException("INVALID_DATES", "endAt cannot be before startAt");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setLocation(request.getLocation());
        event.setStartAt(request.getStartAt());
        event.setEndAt(request.getEndAt());
        event.setCapacity(request.getCapacity());
        event.setUpdatedAt(Instant.now());

        return eventRepository.save(event);
    }

    public Event publishEvent(String id, String userId) {
        Event event = getEvent(id);
        verifyOwnership(event, userId);

        if (event.getStatus() != EventStatus.DRAFT) {
            throw new EventOneException("INVALID_TRANSITION", "Only DRAFT events can be published");
        }

        event.setStatus(EventStatus.PUBLISHED);
        event.setUpdatedAt(Instant.now());
        return eventRepository.save(event);
    }

    private void verifyOwnership(Event event, String userId) {
        if (!event.getOrganizerId().equals(userId)) {
            throw new EventOneException("FORBIDDEN", "You do not own this event");
        }
    }
}
