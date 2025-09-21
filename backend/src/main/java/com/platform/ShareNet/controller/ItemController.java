package com.platform.ShareNet.controller;

import com.platform.ShareNet.model.Item;
import com.platform.ShareNet.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ItemController {
    @Autowired
    private ItemService itemService;

    @GetMapping("/available")
    public ResponseEntity<List<Item>> getAvailableItems(){
        try {
            List<Item> items = itemService.getAllItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadItem(@RequestBody Item item){
        try {
            Item savedItem = itemService.saveItem(item);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item uploaded successfully");
            response.put("item", savedItem);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload item: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

