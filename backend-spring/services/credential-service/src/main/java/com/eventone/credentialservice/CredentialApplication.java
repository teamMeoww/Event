package com.eventone.credentialservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CredentialApplication {
    public static void main(String[] args) {
        SpringApplication.run(CredentialApplication.class, args);
    }
}
