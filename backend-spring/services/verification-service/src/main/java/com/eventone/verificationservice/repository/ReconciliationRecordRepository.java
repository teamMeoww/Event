package com.eventone.verificationservice.repository;
import com.eventone.verificationservice.domain.ReconciliationRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface ReconciliationRecordRepository extends MongoRepository<ReconciliationRecord, String> {
}
