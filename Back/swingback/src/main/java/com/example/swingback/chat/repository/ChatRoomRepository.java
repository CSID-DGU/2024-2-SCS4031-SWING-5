package com.example.swingback.chat.repository;

import com.example.swingback.chat.entity.ChatRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity,String> {
    boolean existsByRoomId(String room_id);

}
