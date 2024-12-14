package com.example.swingback.chat.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class ChatRoom {

    private final String roomId;
    private final String name;

    @Builder
    public ChatRoom(String roomId, String name) {
        this.roomId = roomId;
        this.name = name;
    }

}
