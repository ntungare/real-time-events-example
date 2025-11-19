package com.chat.ws.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;

@Slf4j
@Configuration(proxyBeanMethods = false)
public class MessageHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final Map<String, WebSocketSession> userIdToWebsockets;
    private final Map<String, Map<String, Deque<String>>> userIdToChats;

    public MessageHandler(
            final ObjectMapper objectMapper,
            final Map<String, WebSocketSession> userIdToWebsockets,
            final Map<String, Map<String, Deque<String>>> userIdToChats
    ) {
        this.objectMapper = objectMapper;
        this.userIdToWebsockets = userIdToWebsockets;
        this.userIdToChats = userIdToChats;
    }

    @Override
    public void afterConnectionEstablished(final WebSocketSession session) {
        final var userId = (String) session.getAttributes().get("userId");
        userIdToWebsockets.put(userId, session);
        userIdToChats.putIfAbsent(userId, new TreeMap<>());
    }

    @Override
    public void handleTextMessage(final WebSocketSession session, final TextMessage rawMessage) {
        final var userId = (String) session.getAttributes().get("userId");
        var message = convertMessage(rawMessage);
        if (message.message.isEmpty()) {
            message = new ReceivedMessage(
                    message.fromUserId,
                    message.toUserId,
                    String.format(
                            "Super cool message from %s to %s: %s",
                            message.fromUserId, message.toUserId, UUID.randomUUID()
                    )
            );
        }

        log.info("Received message from userId {}: {}", userId, message);

        if (!userIdToWebsockets.containsKey(message.toUserId)) {
            return;
        }

        userIdToChats.get(message.toUserId)
                .computeIfAbsent(message.fromUserId, _ -> new ArrayDeque<>())
                .addLast(message.message);

        try {
            userIdToWebsockets.get(message.toUserId)
                    .sendMessage(convertMessage(new MessageToSend(message.fromUserId, message.message)));
        } catch (IOException e) {
            log.error("Failed to send message", e);
        }
    }

    @Override
    public void afterConnectionClosed(final WebSocketSession session, final CloseStatus closeStatus) {
        final var userId = (String) session.getAttributes().get("userId");
        userIdToWebsockets.remove(userId);
    }

    ReceivedMessage convertMessage(final TextMessage message) {
        try {
            return objectMapper.readValue(message.getPayload(), new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            log.error("Error converting object", e);
        }

        return null;
    }

    TextMessage convertMessage(final MessageToSend message) {
        try {
            final var textMessage = objectMapper.writeValueAsString(message);
            return new TextMessage(textMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting object", e);
        }

        return null;
    }

    public record ReceivedMessage(String fromUserId, String toUserId, String message) {}

    public record MessageToSend(String userId, String message) {}
}
