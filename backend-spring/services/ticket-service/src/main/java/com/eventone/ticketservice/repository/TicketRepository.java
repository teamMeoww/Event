package com.eventone.ticketservice.repository;

import com.eventone.ticketservice.domain.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    Optional<Ticket> findByPublicId(String publicId);
}
