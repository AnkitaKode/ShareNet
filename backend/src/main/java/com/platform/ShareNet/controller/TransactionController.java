package com.platform.ShareNet.controller;

import com.platform.ShareNet.model.Transaction;
import com.platform.ShareNet.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserTransactions(@PathVariable Long userId){
        try {
            List<Transaction> transactions = transactionService.getTransactionForUser(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("transactions", transactions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get transactions: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createTransaction(@RequestBody Transaction transaction){
        try {
            Transaction savedTransaction = transactionService.saveTransaction(transaction);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Transaction created successfully");
            response.put("transaction", savedTransaction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create transaction: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }


}

