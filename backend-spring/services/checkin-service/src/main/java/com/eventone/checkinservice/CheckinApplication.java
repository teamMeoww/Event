package com.eventone.checkinservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableScheduling
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
public class CheckinApplication {
    public static void main(String[] args) {
        SpringApplication.run(CheckinApplication.class, args);
    }
}
