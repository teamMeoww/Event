package com.eventone.realtimeservice.config;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

@org.springframework.context.annotation.Configuration
public class SocketIoConfig {

    @Value("${eventone.socketio.host}")
    private String host;

    @Value("${eventone.socketio.port}")
    private Integer port;

    @Bean
    public SocketIOServer socketIOServer() {
        Configuration config = new Configuration();
        config.setHostname(host);
        config.setPort(port);
        // In production, we'd add authorization listener here to validate JWT
        return new SocketIOServer(config);
    }
}
