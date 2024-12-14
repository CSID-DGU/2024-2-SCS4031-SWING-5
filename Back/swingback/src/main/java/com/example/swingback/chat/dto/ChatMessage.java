package com.example.swingback.chat.dto;

import com.example.swingback.chat.commons.MessageType;
import lombok.*;
import org.checkerframework.checker.units.qual.N;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class ChatMessage {

//    public enum MessageType {
//        ENTER, TALK , LEAVE
//    }

    private MessageType type;
    private String roomId;
    private String sender;
    private String message;
    private LocalDateTime time;

}
