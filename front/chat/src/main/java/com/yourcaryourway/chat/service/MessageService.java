package com.yourcaryourway.chat.service;

import com.yourcaryourway.chat.model.Conversation;
import com.yourcaryourway.chat.model.Message;
import com.yourcaryourway.chat.model.Utilisateur;
import com.yourcaryourway.chat.repository.ConversationRepository;
import com.yourcaryourway.chat.repository.MessageRepository;
import com.yourcaryourway.chat.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Message sendMessage(Long conversationId, Long senderId, String content) {
        Utilisateur sender = utilisateurRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Expéditeur introuvable"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation introuvable"));

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(content)
                .isRead(false)
                .build();

        Message savedMessage = messageRepository.save(message);

        List<Message> messages = messageRepository
                .findByConversationConversationIdOrderBySentAtAsc(conversationId);

        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversationId + "/messages",
                messages
        );

        return savedMessage;
    }

    public List<Message> findByConversation(Long conversationId) {
        return messageRepository.findByConversationConversationIdOrderBySentAtAsc(conversationId);
    }
}