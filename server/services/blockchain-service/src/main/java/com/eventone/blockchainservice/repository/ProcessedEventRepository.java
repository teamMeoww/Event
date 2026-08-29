package com.eventone.blockchainservice.repository;
import com.eventone.blockchainservice.domain.ProcessedEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
public interface ProcessedEventRepository extends MongoRepository<ProcessedEvent, String> {
    Optional<ProcessedEvent> findByEventIdAndConsumer(String eventId, String consumer);
}
