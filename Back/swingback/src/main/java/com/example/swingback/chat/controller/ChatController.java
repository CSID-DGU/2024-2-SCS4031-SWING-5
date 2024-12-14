package com.example.swingback.chat.controller;

import com.example.swingback.chat.dto.ChatMessage;
import com.example.swingback.chat.dto.ChatRoom;
import com.example.swingback.chat.entity.ChatMessageEntity;
import com.example.swingback.chat.service.ChatService;
import com.example.swingback.error.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    // WebSocketConfig에서 setApplicationDestinationPrefixes()를 통해 prefix를 /pub으로 설정 해주었기 때문에,
    // 경로가 한번 더 수정되어 /pub/chat/message로 바뀐다.
    @MessageMapping("/chat/message")
    public ChatMessage  sendMessage(@Payload ChatMessage message) {
        return chatService.sendMessage(message);
    }

//    @PostMapping("/rooms")
//    public ChatRoom createRoom(@RequestParam Long userId) {
//        return chatService.createRoom(userId);
//    }
//
//    @GetMapping("/rooms")
//    public ChatRoom findAllRoom(@RequestParam Long userId) {
//        return chatService.findRoomById(userId);
//    }
    @PostMapping("/rooms")
    public ChatRoom getOrCreateRoom(@RequestParam Long userId) {
        return chatService.getOrCreateRoom(userId);
    }
    @GetMapping("/rooms/{roomId}/messages")
    public List<ChatMessage> getMessages(@PathVariable String roomId) {
        return chatService.getMessagesByRoomId(roomId);
    }
    @ExceptionHandler(CustomException.class) // 코드가 없을경우 400 에러 발생
    public ResponseEntity<String> handleUnauthorizedException(CustomException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

}
