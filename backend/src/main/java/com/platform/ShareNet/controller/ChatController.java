package com.platform.ShareNet.controller;

import com.platform.ShareNet.model.Chat;
import com.platform.ShareNet.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ChatController {
    @Autowired
    private ChatService chatService;

    @GetMapping("/{user1}/{user2}")
    public ResponseEntity<Map<String, Object>> getChat(@PathVariable Long user1,@PathVariable Long user2){
        try {
            List<Chat> chats = chatService.getChatBetweenUsers(user1, user2);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("chats", chats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get chats: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Chat message){
        try {
            Chat savedMessage = chatService.sendMessage(message);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Message sent successfully");
            response.put("chat", savedMessage);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send message: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
