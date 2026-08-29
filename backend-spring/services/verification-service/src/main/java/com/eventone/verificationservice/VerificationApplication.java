package com.eventone.verificationservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
@EnableScheduling
@EnableCaching
public class VerificationApplication {
    public static void main(String[] args) {
        SpringApplication.run(VerificationApplication.class, args);
    }
    
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
