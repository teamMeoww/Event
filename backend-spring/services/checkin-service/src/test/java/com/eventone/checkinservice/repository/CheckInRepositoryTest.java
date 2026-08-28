package com.eventone.checkinservice.repository;

import com.eventone.checkinservice.domain.CheckIn;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.dao.DuplicateKeyException;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;

@DataMongoTest
public class CheckInRepositoryTest {

    @Autowired
    private CheckInRepository checkInRepository;

    @Test
    public void testDuplicateCheckInThrowsException() {
        String ticketId = UUID.randomUUID().toString();

        CheckIn c1 = new CheckIn();
        c1.setTicketId(ticketId);
        c1.setEventId("EVT_1");
        c1.setUserId("USR_1");
        c1.setCheckedInAt(Instant.now());
        checkInRepository.save(c1);

        CheckIn c2 = new CheckIn();
        c2.setTicketId(ticketId);
        c2.setEventId("EVT_1");
        c2.setUserId("USR_1");
        c2.setCheckedInAt(Instant.now());

        assertThrows(DuplicateKeyException.class, () -> {
            checkInRepository.save(c2);
        });
    }
}
