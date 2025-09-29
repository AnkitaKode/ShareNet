package com.platform.ShareNet.controller;

import com.platform.ShareNet.model.Item;
import com.platform.ShareNet.model.User;
import com.platform.ShareNet.service.ItemService;
import com.platform.ShareNet.service.UserService;
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
    
    @Autowired
    private UserService userService;

    @GetMapping("/available")
    public ResponseEntity<List<Item>> getAvailableItems(){
        try {
            List<Item> items = itemService.getAllItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id){
        try {
            Item item = itemService.getItemById(id);
            if (item != null) {
                return ResponseEntity.ok(item);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadItem(@RequestBody Map<String, Object> itemData){
        try {
            // Create new Item object
            Item item = new Item();
            item.setName((String) itemData.get("name"));
            item.setDescription((String) itemData.get("description"));
            
            // Handle pricePerDay - could be Integer or Double
            Object priceObj = itemData.get("pricePerDay");
            if (priceObj instanceof Number) {
                item.setPricePerDay(((Number) priceObj).doubleValue());
            } else {
                item.setPricePerDay(0.0);
            }
            
            item.setImageUrl((String) itemData.get("imageUrl"));
            item.setAvailable((Boolean) itemData.getOrDefault("isAvailable", true));
            item.setAvailableUntil(null);
            
            // Handle latitude and longitude
            Object latObj = itemData.get("latitude");
            Object lonObj = itemData.get("longitude");
            item.setLatitude(latObj instanceof Number ? ((Number) latObj).doubleValue() : 0.0);
            item.setLongitude(lonObj instanceof Number ? ((Number) lonObj).doubleValue() : 0.0);
            
            // Handle owner - for now, create a default owner or use ID 1
            // In a real app, you'd get this from authentication token
            Object ownerIdObj = itemData.get("ownerId");
            if (ownerIdObj instanceof Number) {
                Long ownerId = ((Number) ownerIdObj).longValue();
                User owner = userService.getUserById(ownerId);
                if (owner != null) {
                    item.setOwner(owner);
                } else {
                    // Create a default owner if not found
                    User defaultOwner = new User();
                    defaultOwner.setId(1L);
                    defaultOwner.setName("Default User");
                    defaultOwner.setEmail("default@sharenet.com");
                    item.setOwner(defaultOwner);
                }
            } else {
                // Create a default owner
                User defaultOwner = new User();
                defaultOwner.setId(1L);
                defaultOwner.setName("Default User");
                defaultOwner.setEmail("default@sharenet.com");
                item.setOwner(defaultOwner);
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

