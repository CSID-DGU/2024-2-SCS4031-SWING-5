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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TotalNotificationService {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final MessageTemplateService messageTemplateService;
    private final FCMService fcmService;
    public void saveNotification(
//            String type,
//                                 Long requestId,
//                                 UserEntity responseId,
//                                 Boolean read,
//                                 Boolean hidden,
//                                 Date scheduledTime,
//                                 Date sendTime,
//                                 Long messageTemplate,
//                                 Map<String, String> variables,
//                                 String token) {
                                    String type,
                                    Long requestId,
                                    UserEntity responseId,
                                    Boolean read,
                                    Boolean hidden,
                                    LocalDateTime scheduledTime,
                                    LocalDateTime sendTime,
                                    MessageTemplateDTO messageTemplateDTO
                                    ) {
//        /*
//        알림보낼 메시지 템플릿을 불러옴
//        messageTemplate : 템플릿 번호
//        variables : 템플릿에 변수를 추가해서 변수를 어떻게 바꿔서 보여줄지 설정하는 부분
//         */
//        MessageTemplateDTO messageTemplateDTO = messageTemplateService.generateMessage(messageTemplate, variables);
        
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
        
//        // FCM알림 전송
//        fcmService.sendNotification(token,messageTemplateDTO.getTitle(),messageTemplateDTO.getBody());

    }

    public List<NotificationTableDTO> getNotificationTable(Long userId) {
        // 로그인한 회원의 userId를 이용해 UserEntity 가져옴
        UserEntity byUserId = userRepository.findByUserId(userId);
        if (byUserId == null) {
            throw new CustomException("알림이 존재하지 않습니다.");
        }

        // UserEntity를 이용해서 가장 최신의 알림 10개 리스트를 가져옴
        // sendTime을 기준으로 가장 최근 순으로 상위 10개를 가져오는 메서드 이용함
        List<TotalNotificationEntity> notificationEntityList
                = notificationRepository.findTop10ByResponseIdOrderBySendTimeDesc(byUserId);

        if (notificationEntityList.isEmpty()) {
            throw new CustomException("알림이 존재하지 않습니다.");
        }

        // 수정된 부분: isRead가 true인 항목을 제거
        List<TotalNotificationEntity> filteredList = notificationEntityList.stream()
                .filter(entity -> !entity.isRead()) // isRead가 false인 항목만 유지
                .toList();


        // 현재 시간을 LocalDateTime으로 가져오기
        LocalDateTime now = LocalDateTime.now();

        // 알림 10개의 리스트를 NotificationTableDTO List로 저장함
        // 예정된 알림시간을 넘어간 경우에만 알림페이지에 보여지도록 수정
        // 필터링된 리스트를 NotificationTableDTO로 변환
        List<NotificationTableDTO> notification = filteredList.stream()
                .map(entity -> {
                    // ScheduledTime이 LocalDateTime이라고 가정
                    if (entity.getScheduledTime().isBefore(now) || entity.getScheduledTime().isEqual(now)) {
                        NotificationTableDTO dto = new NotificationTableDTO();
                        dto.setNotificationId(entity.getNotificationId());
                        dto.setType(entity.getType());       // 알림 타입 설정
                        dto.setMessage(entity.getMessage());  // 메시지 설정
                        dto.setRequestId(entity.getRequestId()); // 요청한 사람 설정
                        dto.setResponseId(entity.getResponseId().getUserId()); // 받는 사람 설정
                        return dto;
                    }
                    return null; // null 반환
                })
                .filter(Objects::nonNull) // null 제거
                .toList();

        return notification;
    }


    public void readButtonClick(Long notificationId) {
        TotalNotificationEntity byId =
                notificationRepository.findById(notificationId)
                        .orElseThrow(()->new CustomException("존재하지 않는 알림입니다."));
        byId.setRead(true);
        notificationRepository.save(byId);
    }
}
