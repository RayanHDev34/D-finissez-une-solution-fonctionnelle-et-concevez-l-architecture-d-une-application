package com.yourcaryourway.chat.controller;

import com.yourcaryourway.chat.model.Conversation;
import com.yourcaryourway.chat.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping("/customer/{customerId}")
    public Conversation createConversation(@PathVariable Long customerId) {
        return conversationService.createConversation(customerId);
    }

    @GetMapping("/customer/{customerId}")
    public List<Conversation> findByCustomer(@PathVariable Long customerId) {
        return conversationService.findByCustomer(customerId);
    }

    @GetMapping("/support")
    public List<Conversation> findForSupport() {
        return conversationService.findForSupport();
    }

    @PutMapping("/{conversationId}/assign/{agentId}")
    public Conversation assignAgent(
            @PathVariable Long conversationId,
            @PathVariable Long agentId
    ) {
        return conversationService.assignAgent(conversationId, agentId);
    }

    @PutMapping("/{conversationId}/close")
    public Conversation closeConversation(@PathVariable Long conversationId) {
        return conversationService.closeConversation(conversationId);
    }
    @GetMapping("/{conversationId}")
    public Conversation findById(@PathVariable Long conversationId) {
        return conversationService.findById(conversationId);
    }
    @GetMapping
    public List<Conversation> findAll() {
        return conversationService.findAll();
    }
}