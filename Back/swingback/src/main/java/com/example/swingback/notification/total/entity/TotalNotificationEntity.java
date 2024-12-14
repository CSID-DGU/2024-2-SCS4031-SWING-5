package com.example.swingback.notification.total.entity;


import com.example.swingback.User.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "total_notification")
public class TotalNotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @Column(name = "type") // 알림 타입 작성 , 가족요청,가족승인알림,가족거부알림 등등
    private String type;

//    @ManyToOne
//    @JoinColumn(name = "user_id") //요청 보낸사람 아이디
//    private UserEntity requestId;
//
//    @Column(name = "response_id") // 알림을 받는사람 아이디
//    private Long responseId;

    @ManyToOne
    @JoinColumn(name = "response_id") //알림 받는 사람 아이디
    private UserEntity responseId;

    @Column(name = "request_id") // 요청 보낸사람 아이디
    private Long requestId;

    @Column(name = "send_time") // 알림을 보낸 시간
    private LocalDateTime sendTime;

    @Column(name = "scheduled_time") // 예정된 알림 시간
    private LocalDateTime scheduledTime;

    @Column(name = "is_read") // 읽음 여부 표시
    private boolean isRead;

    @Column(name = "hidden") // 가족에게 숨길건지 표시
    private boolean hidden;

    @Column(name = "message") // 알림창에 띄워줄 알림 메시지
    private String message;

    public void setRead(boolean read) {
        isRead = read;
    }

    public void setSendTime(LocalDateTime sendTime) {
        this.sendTime = sendTime;
    }
}
