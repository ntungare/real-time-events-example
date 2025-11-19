package com.chat.ws.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketSession;

import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration(proxyBeanMethods = false)
public class ContentConfig {

    @Bean
    Map<String, WebSocketSession> userIdToWebsockets() {
        return new ConcurrentHashMap<>();
    }

    @Bean
    Map<String, Map<String, Deque<String>>> userIdToChats() {
        return new ConcurrentHashMap<>();
    }
}
