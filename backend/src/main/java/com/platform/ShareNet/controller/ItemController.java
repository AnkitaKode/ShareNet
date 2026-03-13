package com.platform.ShareNet.controller;

import com.platform.ShareNet.model.Item;
import com.platform.ShareNet.model.User;
import com.platform.ShareNet.service.ItemService;
import com.platform.ShareNet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        try {
            List<Item> items = itemService.getAllItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Item>> getAvailableItems() {
        try {
            List<Item> items = itemService.getAllItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadItem(@RequestBody Map<String, Object> itemData) {
        try {
            Item item = new Item();
            item.setName((String) itemData.get("name"));
            item.setDescription((String) itemData.get("description"));

            Object priceObj = itemData.get("pricePerDay");
            item.setPricePerDay(priceObj instanceof Number ? ((Number) priceObj).doubleValue() : 0.0);

            item.setImageUrl((String) itemData.get("imageUrl"));

            Object availableObj = itemData.get("isAvailable");
            item.setAvailable(availableObj instanceof Boolean ? (Boolean) availableObj : true);

            item.setAvailableUntil(null);

            Object latObj = itemData.get("latitude");
            Object lonObj = itemData.get("longitude");
            item.setLatitude(latObj instanceof Number ? ((Number) latObj).doubleValue() : 0.0);
            item.setLongitude(lonObj instanceof Number ? ((Number) lonObj).doubleValue() : 0.0);

            Object ownerIdObj = itemData.get("ownerId");
            if (ownerIdObj instanceof Number) {
                Long ownerId = ((Number) ownerIdObj).longValue();
                User owner = userService.getUserById(ownerId);
                if (owner == null) {
                    Map<String, Object> error = new HashMap<>();
                    error.put("success", false);
                    error.put("message", "Owner with id " + ownerId + " not found");
                    return ResponseEntity.badRequest().body(error);
                }
                item.setOwner(owner);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "ownerId is required");
                return ResponseEntity.badRequest().body(error);
            }

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