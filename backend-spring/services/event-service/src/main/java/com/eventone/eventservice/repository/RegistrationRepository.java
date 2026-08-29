package com.eventone.eventservice.repository;

import com.eventone.eventservice.domain.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RegistrationRepository extends MongoRepository<Registration, String> {
}
