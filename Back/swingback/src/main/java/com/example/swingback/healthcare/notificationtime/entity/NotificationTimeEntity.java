package com.example.swingback.healthcare.notificationtime.entity;

import com.example.swingback.User.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Table(name = "notification_time")
public class NotificationTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_time_id")
    private Long notificationTimeId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userId;

    @Column(name = "type")
    private String type; //혈당 ,혈압

    @Column(name = "schedule_time")
    private LocalTime scheduleTime;

    @Column(name = "notification_register_time")
    private LocalDate notificationRegisterTime;

    public void setNotificationRegisterTime(LocalDate notificationRegisterTime) {
        this.notificationRegisterTime = notificationRegisterTime;
    }
}
