package com.example.polls.payload.requests;

import lombok.Getter;
import lombok.Setter;


public class ChatMessageRequest {
    @Getter
    @Setter
    private String chatId;
    @Getter
    @Setter
    private Long senderId;
    @Getter
    @Setter
    private Long recipientId;
    @Getter
    @Setter
    private String senderName;
    @Getter
    @Setter
    private String recipientName;
    @Getter
    @Setter
    private String content;
}
