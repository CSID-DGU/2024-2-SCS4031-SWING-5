package com.example.swingback.notification.total.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationTableDTO {
    private Long notificationId;
    private String type; //알림 타입(가족 요청인지 , 가족요청 거절인지)
    private String message; // message body
    private Long requestId; // 알람 보내는 것을 요청한 사람
    private Long responseId; // 알람을 받는 사람


}
