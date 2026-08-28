package com.eventone.blockchainservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/internal/blockchain")
public class InternalBlockchainQueryController {

    @GetMapping("/owner/{contract}/{tokenId}")
    public ResponseEntity<Map<String, String>> getOwner(@PathVariable String contract, @PathVariable String tokenId) {
        // Normally calls Web3j
        return ResponseEntity.ok(Map.of("owner", "0xSimulatedOwner"));
    }
}
