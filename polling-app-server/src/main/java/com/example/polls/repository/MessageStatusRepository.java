package com.example.polls.repository;

import com.example.polls.model.chat.MessageStatus;
import com.example.polls.model.chat.MessageStatusName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MessageStatusRepository extends JpaRepository<MessageStatus,Long> {
    Optional<MessageStatus> findByName(MessageStatusName status);
}
