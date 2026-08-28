package com.eventone.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> {
            // Use IP address as the default key for rate limiting
            String ipAddress = exchange.getRequest().getRemoteAddress() != null 
                ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress() 
                : "unknown";
            
            // Optionally, if an Authorization header is present, use that to rate limit per user
            String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
            if (authHeader != null && !authHeader.isEmpty()) {
                return Mono.just(authHeader);
            }
            
            return Mono.just(ipAddress);
        };
    }
}
