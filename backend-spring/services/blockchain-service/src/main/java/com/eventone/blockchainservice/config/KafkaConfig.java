package com.eventone.blockchainservice.config;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConfig {
    
    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<Object, Object> template) {
        // Send to eventone.blockchain.dlq after 3 retries (1s backoff)
        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(template,
                (r, e) -> new org.apache.kafka.common.TopicPartition("eventone.blockchain.dlq", r.partition()));
        
        return new DefaultErrorHandler(recoverer, new FixedBackOff(1000L, 3L));
    }
}
