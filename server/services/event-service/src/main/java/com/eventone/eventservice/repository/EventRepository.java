package com.eventone.eventservice.repository;

import com.eventone.eventservice.domain.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EventRepository extends MongoRepository<Event, String> {
    Page<Event> findByOrganizerId(String organizerId, Pageable pageable);
}
