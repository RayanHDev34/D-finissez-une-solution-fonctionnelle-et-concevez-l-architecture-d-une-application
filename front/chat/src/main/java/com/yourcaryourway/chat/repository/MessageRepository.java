package com.yourcaryourway.chat.repository;

import com.yourcaryourway.chat.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationConversationIdOrderBySentAtAsc(Long conversationId);
}