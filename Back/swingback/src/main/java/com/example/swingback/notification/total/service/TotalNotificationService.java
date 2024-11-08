package com.example.swingback.notification.total.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.error.CustomException;
import com.example.swingback.notification.fcmtest.service.FCMService;
import com.example.swingback.notification.message.dto.MessageTemplateDTO;
import com.example.swingback.notification.message.entity.MessageTemplateEntity;
import com.example.swingback.notification.message.repository.MessageTemplateRepository;
import com.example.swingback.notification.message.service.MessageTemplateService;
import com.example.swingback.notification.total.DTO.NotificationTableDTO;
import com.example.swingback.notification.total.entity.TotalNotificationEntity;
import com.example.swingback.notification.total.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TotalNotificationService {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final MessageTemplateService messageTemplateService;
    private final FCMService fcmService;
    public void saveNotification(String type,
                                 Long requestId,
                                 UserEntity responseId,
                                 Boolean read,
                                 Boolean hidden,
                                 Date scheduledTime,
                                 Date sendTime,
                                 Long messageTemplate,
                                 Map<String, String> variables,
                                 String token) {
        /*
        알림보낼 메시지 템플릿을 불러옴
        messageTemplate : 템플릿 번호
        variables : 템플릿에 변수를 추가해서 변수를 어떻게 바꿔서 보여줄지 설정하는 부분
         */
        MessageTemplateDTO messageTemplateDTO = messageTemplateService.generateMessage(messageTemplate, variables);
        
        // 알림 테이블에 알림내역 저장
        TotalNotificationEntity totalNotificationEntity
                = TotalNotificationEntity.builder()
                .type(type)
                .responseId(responseId)
                .requestId(requestId)
                .sendTime(sendTime)
                .scheduledTime(scheduledTime)
                .hidden(hidden)
                .isRead(read)
                .message(messageTemplateDTO.getBody())
                .build();
        notificationRepository.save(totalNotificationEntity);
        
        // FCM알림 전송
        fcmService.sendNotification(token,messageTemplateDTO.getTitle(),messageTemplateDTO.getBody());

    }


    public List<NotificationTableDTO> getNotificationTable(Long userId) {
        // 로그인한 회원의 userid를 이용해 UserEntity 가져옴
        UserEntity byUserId = userRepository.findByUserId(userId);
        if (byUserId==null) {
            throw new CustomException("알림이 존재하지 않습니다.");
        }

        // UserEntity를 이용해서 가장 최신의 알림 10개 리스트를 가져옴
        List<TotalNotificationEntity> notificationEntityList
                = notificationRepository.findTop10ByResponseIdOrderBySendTimeDesc(byUserId);
        if (notificationEntityList.isEmpty()) {
            throw new CustomException("알림이 존재하지 않습니다.");
        }
        //알림 10개의 리스트를 NotificationTableDTO List로 저장함
        List<NotificationTableDTO> notification = notificationEntityList.stream()
                .map(entity -> {
                    NotificationTableDTO dto = new NotificationTableDTO();
                    dto.setNotificationId(entity.getNotificationId());
                    dto.setType(entity.getType());       // 알림 타입 설정
                    dto.setMessage(entity.getMessage());  // 메시지 설정
                    dto.setRequestId(entity.getRequestId()); // 요청한 사람 설정
                    dto.setResponseId(entity.getResponseId().getUserId()); // 받는 사람 설정
                    return dto;
                })
                .toList();



        return notification;
    }


}
