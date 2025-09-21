package com.platform.ShareNet.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to ShareNet API");
        response.put("status", "running");
        response.put("version", "1.0.0");
        response.put("endpoints", Map.of(
            "users", "/api/users",
            "items", "/api/items", 
            "auth", "/api/auth",
            "transactions", "/api/transactions",
            "chats", "/api/chats"
        ));
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "ShareNet Backend");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }

    @GetMapping("/test")
    public Map<String, String> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Test endpoint working");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
