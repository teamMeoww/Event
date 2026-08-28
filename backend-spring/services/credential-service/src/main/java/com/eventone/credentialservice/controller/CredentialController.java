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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/credentials")
public class CredentialController {

    private final CredentialService credentialService;
    private final CredentialRepository credentialRepository;

    public CredentialController(CredentialService credentialService, CredentialRepository credentialRepository) {
        this.credentialService = credentialService;
        this.credentialRepository = credentialRepository;
    }

    @GetMapping
    public ResponseEntity<List<CredentialResponse>> getUserCredentials(@RequestParam String userId) {
        List<Credential> creds = credentialRepository.findByUserId(userId);
        return ResponseEntity.ok(creds.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CredentialResponse> getCredential(@PathVariable String id) {
        return credentialRepository.findById(id)
                .map(cred -> ResponseEntity.ok(mapToResponse(cred)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/revoke")
    public ResponseEntity<Void> revokeCredential(@PathVariable String id) {
        // TODO: Ensure user has ADMIN/ISSUER role
        boolean revoked = credentialService.revokeCredential(id);
        return revoked ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    private CredentialResponse mapToResponse(Credential cred) {
        CredentialResponse res = new CredentialResponse();
        res.setId(cred.getPublicId()); // Expose publicId instead of internal id
        res.setType(cred.getType());
        res.setTitle(cred.getTitle());
        res.setStatus(cred.getStatus());
        res.setIssuedAt(cred.getIssuedAt());

        Map<String, String> eventInfo = new HashMap<>();
        eventInfo.put("id", cred.getEventId());
        eventInfo.put("name", "Event Name (Mock)"); // Real implementation queries event-service
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
