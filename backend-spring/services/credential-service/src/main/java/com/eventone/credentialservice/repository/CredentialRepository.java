package com.eventone.credentialservice.repository;
import com.eventone.credentialservice.domain.Credential;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CredentialRepository extends MongoRepository<Credential, String> {
    List<Credential> findByUserId(String userId);
}
