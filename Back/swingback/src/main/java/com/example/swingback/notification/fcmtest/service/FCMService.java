package com.example.swingback.notification.fcmtest.service;

import com.example.swingback.error.CustomException;
import com.google.firebase.messaging.FirebaseMessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class FCMService {

    public void sendNotification(String token, String title, String body) {
        Map<String,String> data= new HashMap<>();
        data.put("url", "http://localhost:8081/notification"); // 링크 추가
        // 파이어베이스 서버로 요청을 보낼 메시지 만들기
        Message message = Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .putAllData(data)  //data를 메시지에 포함
                .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Successfully sent message: " + response);
        } catch (FirebaseMessagingException e) {
            // FCM 관련 오류 처리
            log.error("FCM 메시지 전송 실패: {}", e.getMessage());
            throw new CustomException("알림 전송에 실패했습니다. 나중에 다시 시도해주세요.");
        } catch (Exception e) {
            // 기타 예외 처리
            log.error("알림 전송 중 오류 발생: {}", e.getMessage());
            throw new CustomException("알림 전송 중 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        }

    }



}
