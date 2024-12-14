package com.example.swingback.chat.repository;

import com.example.swingback.chat.dto.ChatMessage;
import com.example.swingback.chat.entity.ChatMessageEntity;
import com.example.swingback.chat.entity.ChatRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    List<ChatMessageEntity> findByChatRoomId(ChatRoomEntity chatRoom);
}
