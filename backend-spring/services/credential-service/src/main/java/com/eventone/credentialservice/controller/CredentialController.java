package com.eventone.credentialservice.controller;

import com.eventone.credentialservice.domain.Credential;
import com.eventone.credentialservice.dto.CredentialResponse;
import com.eventone.credentialservice.repository.CredentialRepository;
import com.eventone.credentialservice.service.CredentialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/credentials")
public class CredentialController {

    private final CredentialService credentialService;
    private final CredentialRepository credentialRepository;
    private final org.springframework.web.client.RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${eventone.services.event:http://localhost:8083}")
    private String eventServiceUrl;

    public CredentialController(CredentialService credentialService, CredentialRepository credentialRepository, org.springframework.boot.web.client.RestTemplateBuilder restTemplateBuilder) {
        this.credentialService = credentialService;
        this.credentialRepository = credentialRepository;
        this.restTemplate = restTemplateBuilder.build();
    }

    @GetMapping
    public ResponseEntity<List<CredentialResponse>> getUserCredentials(@RequestParam String userId) {
        List<Credential> creds = credentialRepository.findByUserId(userId);
        return ResponseEntity.ok(creds.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CredentialResponse> getCredential(@PathVariable String id) {
        return credentialRepository.findById(Objects.requireNonNull(id, "credentialId"))
                .map(cred -> ResponseEntity.ok(mapToResponse(cred)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/revoke")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Void> revokeCredential(@PathVariable String id) {
        boolean revoked = credentialService.revokeCredential(id);
        return revoked ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    private CredentialResponse mapToResponse(Credential cred) {
        CredentialResponse res = new CredentialResponse();
        res.setId(cred.getPublicId()); // Expose publicId instead of internal id
        res.setType(cred.getType());
        res.setTitle(cred.getTitle());
        res.setWalletAddress(cred.getWalletAddress());
        res.setStatus(cred.getStatus());
        res.setIssuedAt(cred.getIssuedAt());

        Map<String, String> eventInfo = new HashMap<>();
        eventInfo.put("id", cred.getEventId());
        try {
            java.util.Map<String, Object> eventResp = restTemplate.getForObject(eventServiceUrl + "/api/v1/events/" + cred.getEventId(), java.util.Map.class);
            if (eventResp != null && eventResp.containsKey("data")) {
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) eventResp.get("data");
                if (data != null && data.containsKey("name")) {
                    eventInfo.put("name", (String) data.get("name"));
                }
            }
        } catch (Exception e) {
            eventInfo.put("name", "Unknown Event");
        }
        res.setEvent(eventInfo);

        Map<String, Object> blockchainInfo = new HashMap<>();
        blockchainInfo.put("status", cred.getStatus().name());
        blockchainInfo.put("tokenId", cred.getTokenId());
        blockchainInfo.put("transactionHash", cred.getTransactionHash());
        blockchainInfo.put("chainId", cred.getChainId());
        blockchainInfo.put("contractAddress", cred.getContractAddress());
        res.setBlockchain(blockchainInfo);

        return res;
    }
}
