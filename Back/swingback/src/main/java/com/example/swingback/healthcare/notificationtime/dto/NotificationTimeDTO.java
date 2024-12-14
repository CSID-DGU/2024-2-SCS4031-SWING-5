package com.example.swingback.healthcare.notificationtime.dto;

import com.example.swingback.User.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalTime;
import java.util.List;

@Getter
public class NotificationTimeDTO {
    private Long userId;
    private String type;
    private List<LocalTime> scheduleTimeList;
}
