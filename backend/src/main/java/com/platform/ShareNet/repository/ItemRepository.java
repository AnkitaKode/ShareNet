package com.platform.ShareNet.repository;

import com.platform.ShareNet.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    // Field renamed to `available` in Item.java — method name updated accordingly
    List<Item> findByAvailableTrue();
}