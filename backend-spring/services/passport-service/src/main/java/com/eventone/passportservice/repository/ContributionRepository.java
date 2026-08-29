package com.eventone.passportservice.repository;
import com.eventone.passportservice.domain.Contribution;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ContributionRepository extends MongoRepository<Contribution, String> {
    List<Contribution> findByUserId(String userId);
}
