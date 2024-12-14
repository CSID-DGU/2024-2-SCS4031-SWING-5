package com.example.swingback.chat.entity;

import com.example.swingback.chat.commons.MessageType;
import com.example.swingback.chat.dto.ChatMessage;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_message")
public class ChatMessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_message_id")
    private Long chatMessageId;

//    @Column(name = "room_id")
//    private String roomId; // 채팅방 ID
    @Column(name = "sender")
    private String sender; // 보낸 사람
    @Column(name = "message")
    private String message; // 메시지 내용

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private MessageType type; // 메시지 타입 (ENTER, TALK, LEAVE)

    @ManyToOne
    @JoinColumn(name = "room_id") // 기본키가 아닌 필드를 외래키로 지정할 때 설정
    private ChatRoomEntity chatRoomId; // 채팅방 참조

    @Column(name = "date")
    private LocalDateTime dateTime;


}
