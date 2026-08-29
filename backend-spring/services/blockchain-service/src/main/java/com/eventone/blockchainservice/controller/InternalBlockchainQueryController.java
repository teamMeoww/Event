package com.eventone.blockchainservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/internal/blockchain")
public class InternalBlockchainQueryController {

    private final com.eventone.blockchainservice.service.Web3Client web3Client;

    public InternalBlockchainQueryController(com.eventone.blockchainservice.service.Web3Client web3Client) {
        this.web3Client = web3Client;
    }

    @GetMapping("/owner/{contract}/{tokenId}")
    public ResponseEntity<Map<String, String>> getOwner(@PathVariable String contract, @PathVariable String tokenId) {
        try {
            org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                    "ownerOf",
                    java.util.List.of(new org.web3j.abi.datatypes.generated.Uint256(new java.math.BigInteger(tokenId))),
                    java.util.List.of(new org.web3j.abi.TypeReference<org.web3j.abi.datatypes.Address>() {})
            );
            String encoded = org.web3j.abi.FunctionEncoder.encode(function);
            org.web3j.protocol.core.methods.response.EthCall response = web3Client.getWeb3j().ethCall(
                    org.web3j.protocol.core.methods.request.Transaction.createEthCallTransaction(null, contract, encoded),
                    org.web3j.protocol.core.DefaultBlockParameterName.LATEST
            ).send();
            
            if (response.hasError() || response.getValue() == null || response.getValue().equals("0x")) {
                return ResponseEntity.notFound().build();
            }
            
            java.util.List<org.web3j.abi.datatypes.Type> decoded = org.web3j.abi.FunctionReturnDecoder.decode(
                    response.getValue(), function.getOutputParameters());
            
            if (decoded.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            String owner = decoded.get(0).getValue().toString();
            return ResponseEntity.ok(Map.of("owner", owner));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
