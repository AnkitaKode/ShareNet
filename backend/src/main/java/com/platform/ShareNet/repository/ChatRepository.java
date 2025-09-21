package com.platform.ShareNet.repository;

import com.platform.ShareNet.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChatRepository extends JpaRepository<Chat,Long> {
    @Query("SELECT c FROM Chat c WHERE (c.sender.id = :user1 AND c.receiver.id = :user2) OR (c.sender.id = :user2 AND c.receiver.id = :user1) ORDER BY c.timeStamp")
    List<Chat> findChatsBetweenUsers(@Param("user1") Long user1, @Param("user2") Long user2);
}
