package com.eventone.verificationservice.service;

import com.eventone.verificationservice.domain.ReconciliationRecord;
import com.eventone.verificationservice.repository.ReconciliationRecordRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class BlockchainReconciliationService {

    private final ReconciliationRecordRepository repository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public BlockchainReconciliationService(ReconciliationRecordRepository repository, KafkaTemplate<String, Object> kafkaTemplate) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public void reconcileTicket(String ticketId, String mongoState, String chainState) {
        if (!mongoState.equals(chainState)) {
            ReconciliationRecord rec = new ReconciliationRecord();
            rec.setEntityType("TICKET");
            rec.setEntityId(ticketId);
            rec.setExpectedState(mongoState);
            rec.setActualState(chainState);
            rec.setDetectedAt(Instant.now());
            
            // Safe repair logic heuristic
            if (chainState.equals("REVOKED") && mongoState.equals("VALID")) {
                rec.setStatus("PENDING");
                rec.setDetails("Blockchain shows revoked. Propagating to DB is safe.");
                
                // Trigger async repair message
                Map<String, Object> payload = new HashMap<>();
                payload.put("ticketId", ticketId);
                payload.put("action", "FORCE_REVOKE");
                payload.put("source", "RECONCILIATION");
                
                kafkaTemplate.send("ticket-repair-events", ticketId, payload);
                rec.setStatus("REPAIR_REQUESTED");
            } else {
                rec.setStatus("MANUAL_REVIEW");
            }
            repository.save(rec);
        }
    }
}
