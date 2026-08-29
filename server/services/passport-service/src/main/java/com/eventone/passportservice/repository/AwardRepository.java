package com.eventone.passportservice.repository;
import com.eventone.passportservice.domain.Award;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AwardRepository extends MongoRepository<Award, String> {
    List<Award> findByUserId(String userId);
}
