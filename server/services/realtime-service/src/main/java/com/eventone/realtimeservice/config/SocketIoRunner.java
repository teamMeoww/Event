package com.eventone.realtimeservice.config;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import jakarta.annotation.PreDestroy;

@Component
public class SocketIoRunner implements CommandLineRunner {

    private final SocketIOServer server;

    public SocketIoRunner(SocketIOServer server) {
        this.server = server;
    }

    @Override
    public void run(String... args) throws Exception {
        server.start();
        System.out.println("Socket.IO server started on port " + server.getConfiguration().getPort());
        
        server.addEventListener("join_room", String.class, (client, data, ackSender) -> {
            // Client asks to join event:{eventId}
            client.joinRoom(data);
            System.out.println("Client " + client.getSessionId() + " joined room: " + data);
        });
    }

    @PreDestroy
    public void stop() {
        server.stop();
    }
}
