package com.platform.ShareNet.service;

import com.platform.ShareNet.model.Chat;
import com.platform.ShareNet.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;


    public List<Chat> getChatBetweenUsers(Long user1, Long user2){
        return chatRepository.findChatsBetweenUsers(user1, user2);
    }
    public Chat sendMessage(Chat message){
        message.setTimeStamp(LocalDateTime.now());
        return chatRepository.save(message);

    }
}
