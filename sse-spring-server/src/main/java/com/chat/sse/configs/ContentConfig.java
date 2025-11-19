package com.chat.sse.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration(proxyBeanMethods = false)
public class ContentConfig {

    @Bean
    Map<String, SseEmitter> userIdToEmitter() {
        return new ConcurrentHashMap<>();
    }

    @Bean
    Map<String, Map<String, Deque<String>>> userIdToChats() {
        return new ConcurrentHashMap<>();
    }
}
