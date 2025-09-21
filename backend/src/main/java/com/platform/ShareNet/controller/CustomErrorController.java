package com.platform.ShareNet.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        Object status = request.getAttribute("javax.servlet.error.status_code");
        
        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());
            
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                response.put("error", "Not Found");
                response.put("message", "The requested resource was not found");
                response.put("status", 404);
                response.put("availableEndpoints", Map.of(
                    "home", "/",
                    "health", "/health",
                    "users", "/api/users/*",
                    "items", "/api/items/*",
                    "transactions", "/api/transactions/*",
                    "chats", "/api/chats/*"
                ));
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            } else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                response.put("error", "Internal Server Error");
                response.put("message", "An internal server error occurred");
                response.put("status", 500);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }
        
        response.put("error", "Unknown Error");
        response.put("message", "An unknown error occurred");
        response.put("status", 500);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
