package com.example.polls.repository;



import com.example.polls.model.chat.ChatMessage;
import com.example.polls.model.chat.MessageStatusName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository
        extends JpaRepository<ChatMessage, Long> {

    long countBySenderIdAndRecipientIdAndStatus(
            Long senderId, Long recipientId, MessageStatusName status);

    List<ChatMessage> findByChatId(String chatId);
}
