package com.example.swingback.chat.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.chat.dto.ChatMessage;
import com.example.swingback.chat.dto.ChatRoom;
import com.example.swingback.chat.entity.ChatMessageEntity;
import com.example.swingback.chat.entity.ChatRoomEntity;
import com.example.swingback.chat.repository.ChatMessageRepository;
import com.example.swingback.chat.repository.ChatRoomRepository;
import com.example.swingback.error.CustomException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatService {

    private Map<String, ChatRoom> chatRooms;
    private final SimpMessagingTemplate template;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;

    @PostConstruct
    private void init() {
        chatRooms = new LinkedHashMap<>();
//        ChatRoom defaultRoom = ChatRoom.builder()
//                .roomId("1")
//                .name("Default Room")
//                .build();
//        chatRooms.put("1", defaultRoom);
    }

    public List<ChatRoom> findAllRoom() {
        return new ArrayList<>(chatRooms.values());
    }

    public ChatRoom findRoomById(Long userId) {
        String familyId = userRepository.findByUserId(userId).getFamily().getFamilyId();
        if (chatRoomRepository.existsByRoomId(familyId)) {
            ChatRoomEntity byId =
                    chatRoomRepository.findById(familyId).
                            orElseThrow(() -> new CustomException("해당 방이 존재하지 않습니다."));
            return chatRooms.get(familyId);
        } else {
            throw new CustomException("채팅방이 존재하지 않습니다.");
        }
    }

    public ChatRoom createRoom(Long userId) {
        // userId로 familyId 가져오기
        UserEntity byUserId = userRepository.findByUserId(userId);
        String familyId = byUserId.getFamily().getFamilyId();

        // familyId가 roomId로 이미 존재하는지 확인
        if (chatRoomRepository.existsByRoomId(familyId)) {
            // 존재하면 ChatRoom 생성 및 반환
            ChatRoom chatRoom = ChatRoom.builder()
                    .roomId(familyId)
                    .name(userRepository.findByUserId(userId).getFamilyRole() + " 가족방")
                    .build();

            chatRooms.put(familyId, chatRoom);
            return chatRoom;
        } else {
            // 존재하지 않으면 새로운 채팅방 생성
            ChatRoom newChatRoom = ChatRoom.builder()
                    .roomId(familyId)
                    .name(userRepository.findByUserId(userId).getFamilyRole() + " 가족방")
                    .build();

            // chatRooms 맵에 저장
            chatRooms.put(familyId, newChatRoom);
            ChatRoomEntity chatRoom = ChatRoomEntity.builder()
                    .roomId(familyId)
                    .roomName(userRepository.findByUserId(userId).getFamilyRole() + " 가족방")
                    .userId(byUserId)
                    .build();
            // 필요 시 DB에도 저장 가능 (채팅방 정보를 저장하는 Repository가 있을 경우)
            chatRoomRepository.save(chatRoom);

            return newChatRoom; // 새로 생성한 방 반환
        }

    }

    // /sub을 Config에서 설정해주었다.
    // 그래서 Message Broker가 해당 send를 캐치하고 해당 토픽을 구독하는 모든 사람에게 메시지를 보내게 된다.
    public ChatMessage sendMessage(ChatMessage message) {
        // 메시지 저장로직 추가
//        ChatRoom chatRoom = chatRooms.get(message.getRoomId());
        ChatRoomEntity chatRoom = chatRoomRepository.findById(message.getRoomId())
                .orElseThrow(() -> new CustomException("채팅방이 존재하지 않습니다"));
        ChatMessageEntity entity = ChatMessageEntity.builder()
                .chatRoomId(chatRoom)
                .sender(message.getSender())
                .message(message.getMessage())
                .type(message.getType())
                .dateTime(LocalDateTime.now())
                .build();
        ChatMessageEntity saveMessage = chatMessageRepository.save(entity);

        // ex) roomId가 2일때, /sub/chat/room/2를 구독하는 유저들에게 모두 메시지가 보낸다.
        template.convertAndSend("/sub/chat/room/" + saveMessage.getChatRoomId().getRoomId(), message);
        // 엔티티 -> DTO 변환
        return ChatMessage.builder()
                .roomId(saveMessage.getChatRoomId().getRoomId())
                .sender(saveMessage.getSender())
                .message(saveMessage.getMessage())
                .type(saveMessage.getType())
                .time(saveMessage.getDateTime())
                .build();
    }

    public List<ChatMessage> getMessagesByRoomId(String roomId) {
        ChatRoomEntity chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException("채팅방이 존재하지 않습니다"));

        // 채팅방에 속한 메시지들을 조회
        List<ChatMessageEntity> messageEntities = chatMessageRepository.findByChatRoomId(chatRoom);

        // 엔티티 -> DTO 변환
        return messageEntities.stream()
                .map(entity -> ChatMessage.builder()
                        .roomId(entity.getChatRoomId().getRoomId())
                        .sender(entity.getSender())
                        .message(entity.getMessage())
                        .type(entity.getType())
                        .time(entity.getDateTime())
                        .build())
                .toList();
    }
    public ChatRoom getOrCreateRoom(Long userId) {
        // userId를 기반으로 familyId 조회
        UserEntity user = userRepository.findByUserId(userId);
        String familyId = user.getFamily().getFamilyId();
        if (familyId == null) {
            throw new CustomException("가족 가입이 되어있지 않습니다 , 가족을 생성한 후 다시 시도해주세요");
        }

        // 가족 채팅방이 이미 존재하는 경우 반환
        if (chatRoomRepository.existsByRoomId(familyId)) {
            ChatRoomEntity chatRoomEntity = chatRoomRepository.findById(familyId)
                    .orElseThrow(() -> new CustomException("채팅방이 존재하지 않습니다."));
            return ChatRoom.builder()
                    .roomId(chatRoomEntity.getRoomId())
                    .name(chatRoomEntity.getRoomName())
                    .build();
        }

        // 채팅방이 존재하지 않는 경우 새로 생성
        ChatRoom newChatRoom = ChatRoom.builder()
                .roomId(familyId)
                .name(user.getFamilyRole() + " 가족방")
                .build();

        ChatRoomEntity newChatRoomEntity = ChatRoomEntity.builder()
                .roomId(familyId)
                .roomName(newChatRoom.getName())
                .userId(user)
                .build();

        chatRoomRepository.save(newChatRoomEntity);
        return newChatRoom;
    }


}