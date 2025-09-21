package com.platform.ShareNet.service;

import com.platform.ShareNet.model.Item;
import com.platform.ShareNet.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {
    @Autowired
    public ItemRepository itemRepository;

    public Item saveItem(Item item){
        return itemRepository.save(item);
    }
    public List<Item> getAvailableItems(){
        return itemRepository.findByIsAvailableTrue();
    }
    public List<Item> getAllItems(){
        return itemRepository.findAll();
    }

}
