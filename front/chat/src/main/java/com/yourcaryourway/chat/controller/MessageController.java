package com.yourcaryourway.chat.controller;

import com.yourcaryourway.chat.model.Message;
import com.yourcaryourway.chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public Message sendMessage(@RequestBody SendMessageRequest request) {
        return messageService.sendMessage(
                request.conversationId(),
                request.senderId(),
                request.content()
        );
    }

    @GetMapping("/conversation/{conversationId}")
    public List<Message> findByConversation(@PathVariable Long conversationId) {
        return messageService.findByConversation(conversationId);
    }

    public record SendMessageRequest(
            Long conversationId,
            Long senderId,
            String content
    ) {}
}