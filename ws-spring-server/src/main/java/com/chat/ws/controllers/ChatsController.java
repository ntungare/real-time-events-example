package com.chat.ws.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Deque;
import java.util.Map;

@RestController
public class ChatsController {

    private final Map<String, Map<String, Deque<String>>> userIdToChats;

    public ChatsController(final Map<String, Map<String, Deque<String>>> userIdToChats) {
        this.userIdToChats = userIdToChats;
    }

    @GetMapping("/chat")
    public Map<String, Deque<String>> chat(@RequestParam("userId") final String userId) {
        return userIdToChats.getOrDefault(userId, Collections.emptyMap());
    }
}
