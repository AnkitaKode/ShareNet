package com.platform.ShareNet.controller;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    private final ErrorAttributes errorAttributes;

    public CustomErrorController(ErrorAttributes errorAttributes) {
        this.errorAttributes = errorAttributes;
    }

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(WebRequest webRequest) {

        // Use Spring's ErrorAttributes — works correctly in Boot 3.x
        Map<String, Object> attrs = errorAttributes.getErrorAttributes(
            webRequest,
            ErrorAttributeOptions.of(
                ErrorAttributeOptions.Include.MESSAGE,
                ErrorAttributeOptions.Include.EXCEPTION
            )
        );

        // Extract status from ErrorAttributes (reliable in Boot 3.x)
        int statusCode = 500;
        Object statusObj = attrs.get("status");
        if (statusObj instanceof Integer) {
            statusCode = (Integer) statusObj;
        }

        HttpStatus status = HttpStatus.resolve(statusCode);
        if (status == null) status = HttpStatus.INTERNAL_SERVER_ERROR;

        Map<String, Object> response;

        if (statusCode == 404) {
            response = Map.of(
                "error", "Not Found",
                "message", "The requested resource was not found",
                "status", 404,
                "availableEndpoints", Map.of(
                    "home",         "/",
                    "health",       "/health",
                    "users",        "/api/users/*",
                    "items",        "/api/items/*",
                    "transactions", "/api/transactions/*",
                    "chats",        "/api/chats/*"
                )
            );
        } else if (statusCode == 401) {
            response = Map.of(
                "error", "Unauthorized",
                "message", "Authentication is required",
                "status", 401
            );
        } else if (statusCode == 403) {
            response = Map.of(
                "error", "Forbidden",
                "message", "You do not have permission to access this resource",
                "status", 403
            );
        } else {
            // For 500 and anything else, include the real error message from Spring
            String message = (String) attrs.getOrDefault("message", "An internal server error occurred");
            response = Map.of(
                "error", "Internal Server Error",
                "message", message,
                "status", statusCode
            );
        }

        return ResponseEntity.status(status).body(response);
    }
}