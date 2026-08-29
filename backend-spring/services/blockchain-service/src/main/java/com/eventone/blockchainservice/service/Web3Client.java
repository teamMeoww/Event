package com.eventone.blockchainservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import jakarta.annotation.PostConstruct;

@Component
public class Web3Client {

    @Value("${blockchain.rpc-url}")
    private String rpcUrl;

    @Value("${blockchain.private-key}")
    private String privateKey;

    private Web3j web3j;
    private Credentials credentials;

    @PostConstruct
    public void init() {
        this.web3j = Web3j.build(new HttpService(rpcUrl));
        this.credentials = Credentials.create(privateKey);
    }

    public Web3j getWeb3j() {
        return web3j;
    }

    public Credentials getCredentials() {
        return credentials;
    }
}
