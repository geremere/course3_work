package com.example.polls.service;

import com.example.polls.exception.AppException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.chat.ChatMessage;
import com.example.polls.model.chat.MessageStatus;
import com.example.polls.model.chat.MessageStatusName;
import com.example.polls.repository.ChatMessageRepository;
import com.example.polls.repository.MessageStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatMessageService {
    @Autowired private ChatMessageRepository repository;
    @Autowired private ChatRoomService chatRoomService;
    @Autowired private MessageStatusRepository messageStatusRepository;

    public ChatMessage save(ChatMessage chatMessage) {
        MessageStatus status = messageStatusRepository.findByName(MessageStatusName.RECEIVED).
                orElseThrow(() -> new AppException("some error with set status for message"));

        chatMessage.setStatus(status);
        repository.save(chatMessage);
        return chatMessage;
    }

    public long countNewMessages(Long senderId, Long recipientId) {
        return repository.countBySenderIdAndRecipientIdAndStatus(
                senderId, recipientId, MessageStatusName.RECEIVED);
    }

    public List<ChatMessage> findChatMessages(Long senderId, Long recipientId) {
        var chatId = chatRoomService.getChatId(senderId, recipientId, false);

        var messages =
                chatId.map(cId -> repository.findByChatId(cId)).orElse(new ArrayList<>());

        MessageStatus status = messageStatusRepository.findByName(MessageStatusName.DELIVERED).
                orElseThrow(() -> new AppException("some error with set status for message"));

        for(ChatMessage mess : messages){
            mess.setStatus(status);
            repository.save(mess);
        }

        return messages;
    }

    public ChatMessage findById(Long id) {
        MessageStatus status = messageStatusRepository.findByName(MessageStatusName.DELIVERED).
                orElseThrow(() -> new AppException("some error with set status for message"));
        return repository
                .findById(id)
                .map(chatMessage -> {
                    chatMessage.setStatus(status);
                    return repository.save(chatMessage);
                })
                .orElseThrow(() ->
                        new ResourceNotFoundException("findById message","id",id));
    }
}