package com.example.swingback.notification.fcmtest.dto;

import lombok.Getter;

@Getter
public class NotificationRequestDTO {
    private String token;
    private String title;
    private String body;
}
