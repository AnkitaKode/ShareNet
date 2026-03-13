package com.platform.ShareNet.controller;

import com.platform.ShareNet.model.BorrowRequest;
import com.platform.ShareNet.service.BorrowRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class RequestController {

    @Autowired
    private BorrowRequestService borrowRequestService;

    @PostMapping("/requests")
    public ResponseEntity<Map<String, Object>> createBorrowRequest(@RequestBody BorrowRequest request) {
        try {
            BorrowRequest createdRequest = borrowRequestService.createBorrowRequest(request);
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Borrow request created successfully",
                "request", createdRequest
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to create borrow request: " + e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/requests/user/{userId}")
    public ResponseEntity<List<BorrowRequest>> getUserRequests(@PathVariable Long userId) {
        try {
            List<BorrowRequest> requests = borrowRequestService.getUserRequests(userId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/requests/{id}/status")
    public ResponseEntity<Map<String, Object>> updateRequestStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            BorrowRequest updatedRequest = borrowRequestService.updateRequestStatus(id, status);
            
            if (updatedRequest != null) {
                Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Request status updated successfully",
                    "request", updatedRequest
                );
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = Map.of(
                    "success", false,
                    "message", "Request not found"
                );
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to update request status: " + e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/requests/pending/owner/{ownerId}")
    public ResponseEntity<List<BorrowRequest>> getPendingRequestsForOwner(@PathVariable Long ownerId) {
        try {
            List<BorrowRequest> requests = borrowRequestService.getPendingRequestsForOwner(ownerId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
