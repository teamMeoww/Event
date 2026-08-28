package com.eventone.passportservice.repository;
import com.eventone.passportservice.domain.Achievement;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AchievementRepository extends MongoRepository<Achievement, String> {
    List<Achievement> findByUserId(String userId);
}
