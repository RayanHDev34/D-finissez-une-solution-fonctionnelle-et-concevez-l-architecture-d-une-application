package com.yourcaryourway.chat.repository;

import com.yourcaryourway.chat.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    List<Conversation> findByCustomerUtilisateurIdOrderByCreatedAtDesc(Long customerId);

    List<Conversation> findByAgentUtilisateurIdOrderByCreatedAtDesc(Long agentId);

    List<Conversation> findByStatusOrderByCreatedAtDesc(String status);

    List<Conversation> findAllByOrderByCreatedAtDesc();
}