package com.eventone.verificationservice.service;

import com.eventone.verificationservice.domain.ReconciliationRecord;
import com.eventone.verificationservice.repository.ReconciliationRecordRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;

@Service
public class BlockchainReconciliationService {

    private final ReconciliationRecordRepository repository;

    public BlockchainReconciliationService(ReconciliationRecordRepository repository) {
        this.repository = repository;
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
                // trigger async repair message here
            } else {
                rec.setStatus("MANUAL_REVIEW");
            }
            repository.save(rec);
        }
    }
}
