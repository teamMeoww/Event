package com.eventone.realtimeservice.consumer;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Component
public class CheckinKafkaConsumer {

    private final SocketIOServer server;
    private final StringRedisTemplate redisTemplate;

    public CheckinKafkaConsumer(SocketIOServer server, StringRedisTemplate redisTemplate) {
        this.server = server;
        this.redisTemplate = redisTemplate;
    }

    @KafkaListener(topics = "eventone.checkins.events", groupId = "realtime-service-group")
    public void consumeCheckinCompleted(Map<String, Object> payload) {
        String checkInId = (String) payload.get("checkInId");
        if (checkInId == null || !isIdempotent("realtime_checkin:" + checkInId)) return;

        String eventId = (String) payload.get("eventId");
        String ticketId = (String) payload.get("ticketId");
        
        if (eventId != null) {
            String room = "event:" + eventId;
            
            // Emit ticket:checked-in
            Map<String, Object> ticketEvent = new HashMap<>();
            ticketEvent.put("ticketId", ticketId);
            ticketEvent.put("eventId", eventId);
            ticketEvent.put("status", "CHECKED_IN");
            ticketEvent.put("checkedInAt", payload.get("checkedInAt"));
            
            server.getRoomOperations(room).sendEvent("ticket:checked-in", ticketEvent);
            
            // Normally, query DB for exact count, but to avoid DB coupling here, 
            // the CheckinService could include updated count in payload, 
            // or realtime-service could use a REST call to checkin-service.
            // For now we just emit the increment.
            server.getRoomOperations(room).sendEvent("attendance:updated", Map.of(
                "eventId", eventId,
                "increment", 1
            ));
            
            System.out.println("Broadcasted real-time events for room: " + room);
        }
    }
    
    @KafkaListener(topics = "eventone.credentials.events", groupId = "realtime-service-group")
    public void consumeCredentialEvents(Map<String, Object> payload) {
        String eventType = (String) payload.get("eventType");
        String eventId = (String) payload.get("eventId");
        String txHash = (String) payload.get("transactionHash");
        String uniqueId = eventId != null ? eventId : (txHash != null ? txHash : String.valueOf(payload.hashCode()));
        
        if (!isIdempotent("realtime_cred:" + uniqueId + ":" + eventType)) return;
        
        if ("CREDENTIAL_BLOCKCHAIN_CONFIRMED".equals(eventType) || "CREDENTIAL_BLOCKCHAIN_REVOKED".equals(eventType)) {
            String pubEventId = (String) payload.get("publicEventId");
            if (pubEventId != null) {
                String room = "event:" + pubEventId;
                server.getRoomOperations(room).sendEvent(
                    "CREDENTIAL_BLOCKCHAIN_CONFIRMED".equals(eventType) ? "credential:issued" : "credential:revoked", 
                    payload
                );
            }
        }
    }

    private boolean isIdempotent(String key) {
        Boolean set = redisTemplate.opsForValue().setIfAbsent("idemp:" + key, "processed", Duration.ofHours(24));
        return Boolean.TRUE.equals(set);
    }
}
