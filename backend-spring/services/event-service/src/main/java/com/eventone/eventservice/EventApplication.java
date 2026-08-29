package com.eventone.eventservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
public class EventApplication {
    public static void main(String[] args) {
        SpringApplication.run(EventApplication.class, args);
    }
}
