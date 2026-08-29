package com.eventone.checkinservice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {

    private final Map<String, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String eventId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Infinite timeout
        
        List<SseEmitter> eventEmitters = emitters.computeIfAbsent(eventId, k -> new CopyOnWriteArrayList<>());
        eventEmitters.add(emitter);

        emitter.onCompletion(() -> eventEmitters.remove(emitter));
        emitter.onTimeout(() -> eventEmitters.remove(emitter));
        emitter.onError((e) -> eventEmitters.remove(emitter));

        try {
            // Send initial connection event
            emitter.send(SseEmitter.event().name("INIT").data("Connected for event: " + eventId));
        } catch (IOException e) {
            emitter.completeWithError(e);
            eventEmitters.remove(emitter);
        }

        return emitter;
    }

    public void broadcastCheckin(String eventId, String message) {
        List<SseEmitter> eventEmitters = emitters.get(eventId);
        if (eventEmitters != null) {
            for (SseEmitter emitter : eventEmitters) {
                try {
                    emitter.send(SseEmitter.event().name("CHECKIN").data(message));
                } catch (IOException e) {
                    emitter.complete();
                    eventEmitters.remove(emitter);
                }
            }
        }
    }
}
