package com.example.swingback.chat.entity;

import com.example.swingback.User.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.mapping.ToOne;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_room")
@Getter
public class ChatRoomEntity {

    @Id
    @Column(name = "room_id")
    private String roomId;

    @Column(name = "room_name")
    private String roomName;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userId;
}


