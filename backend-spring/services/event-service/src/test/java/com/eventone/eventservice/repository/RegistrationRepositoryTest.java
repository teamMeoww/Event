package com.eventone.eventservice.repository;

import com.eventone.eventservice.domain.Registration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.dao.DuplicateKeyException;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;

@DataMongoTest
public class RegistrationRepositoryTest {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Test
    public void testDuplicateRegistrationThrowsException() {
        String userId = UUID.randomUUID().toString();
        String eventId = UUID.randomUUID().toString();

        Registration r1 = new Registration();
        r1.setUserId(userId);
        r1.setEventId(eventId);
        r1.setStatus("registered");
        r1.setRegisteredAt(Instant.now());
        registrationRepository.save(r1);

        Registration r2 = new Registration();
        r2.setUserId(userId);
        r2.setEventId(eventId);
        r2.setStatus("registered");
        r2.setRegisteredAt(Instant.now());

        assertThrows(DuplicateKeyException.class, () -> {
            registrationRepository.save(r2);
        });
    }
}
