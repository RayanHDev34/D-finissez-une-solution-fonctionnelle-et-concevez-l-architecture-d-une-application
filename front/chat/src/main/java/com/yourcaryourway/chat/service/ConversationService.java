package com.yourcaryourway.chat.service;

import com.yourcaryourway.chat.model.Conversation;
import com.yourcaryourway.chat.model.Utilisateur;
import com.yourcaryourway.chat.repository.ConversationRepository;
import com.yourcaryourway.chat.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Conversation createConversation(Long customerId) {
        Utilisateur customer = utilisateurRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        Conversation conversation = Conversation.builder()
                .customer(customer)
                .status("OPEN")
                .build();

        Conversation savedConversation = conversationRepository.save(conversation);

        messagingTemplate.convertAndSend(
                "/topic/support/conversations",
                savedConversation
        );

        return savedConversation;
    }
    public Conversation findById(Long conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation introuvable"));
    }
    public List<Conversation> findByCustomer(Long customerId) {
        return conversationRepository.findByCustomerUtilisateurIdOrderByCreatedAtDesc(customerId);
    }

    public List<Conversation> findForSupport() {
        return conversationRepository.findAllByOrderByCreatedAtDesc();
    }

    public Conversation assignAgent(Long conversationId, Long agentId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation introuvable"));

        Utilisateur agent = utilisateurRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent support introuvable"));

        conversation.setAgent(agent);
        conversation.setStatus("IN_PROGRESS");

        Conversation updatedConversation = conversationRepository.save(conversation);

        messagingTemplate.convertAndSend(
                "/topic/support/conversations",
                updatedConversation
        );

        return updatedConversation;
    }

    public Conversation closeConversation(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation introuvable"));

        conversation.setStatus("CLOSED");
        conversation.setClosedAt(LocalDateTime.now());

        Conversation updatedConversation = conversationRepository.save(conversation);

        messagingTemplate.convertAndSend(
                "/topic/support/conversations",
                updatedConversation
        );

        return updatedConversation;
    }

    public List<Conversation> findAll() {
        return conversationRepository.findAll();
    }
}