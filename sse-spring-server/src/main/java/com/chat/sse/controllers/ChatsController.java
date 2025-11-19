package com.chat.sse.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.*;

@Slf4j
@RestController
public class ChatsController {

    private final Map<String, Map<String, Deque<String>>> userIdToChats;
    private final Map<String, SseEmitter> userIdToEmitter;

    public ChatsController(
            final Map<String, Map<String, Deque<String>>> userIdToChats,
            final Map<String, SseEmitter> userIdToEmitter
    ) {
        this.userIdToChats = userIdToChats;
        this.userIdToEmitter = userIdToEmitter;
    }

    @GetMapping("/chat")
    public Map<String, Deque<String>> chat(@RequestParam("userId") final String userId) {
        return userIdToChats.getOrDefault(userId, Collections.emptyMap());
    }

    @GetMapping("/listen/{userId}")
    public SseEmitter getEventSourceForUserId(@PathVariable final String userId) {
        userIdToChats.putIfAbsent(userId, new TreeMap<>());
        userIdToEmitter.put(userId, new SseEmitter());

        return userIdToEmitter.get(userId);
    }

    public record ReceivedMessage(String fromUserId, String toUserId, String message) {}

    public record MessageToSend(String userId, String message) {}

    @PostMapping("/chat")
    public void sendMessage(@RequestBody final ReceivedMessage body) throws Exception {
        var message = body;
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

        log.info("Received message from userId {}: {}", message.fromUserId, message);

        if (!userIdToChats.containsKey(message.toUserId) || !userIdToEmitter.containsKey(message.toUserId)) {
            throw new Exception("failed to send message");
        }

        userIdToChats.get(message.toUserId)
                .computeIfAbsent(message.fromUserId, _ -> new ArrayDeque<>())
                .addLast(message.message);
        try {
            userIdToEmitter.get(message.toUserId)
                    .send(makeSseEventBuilder(message));
        } catch (IOException e) {
            log.error("Failed to send message", e);
        }
    }

    SseEmitter.SseEventBuilder makeSseEventBuilder(final ReceivedMessage message) {
        return SseEmitter.event()
                .id(UUID.randomUUID().toString())
                .comment(String.format("from '%s' to '%s'", message.fromUserId, message.toUserId))
                .data(new MessageToSend(message.fromUserId, message.message));
    }
}
