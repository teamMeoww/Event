package com.eventone.passportservice.repository;
import com.eventone.passportservice.domain.Passport;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PassportRepository extends MongoRepository<Passport, String> {
    Optional<Passport> findByUserId(String userId);
}
