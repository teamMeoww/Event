package com.eventone.checkinservice.repository;

import com.eventone.checkinservice.domain.CheckIn;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CheckInRepository extends MongoRepository<CheckIn, String> {
}
