package com.example.swingback.notification.token.dto;

import lombok.Getter;

@Getter
public class FCMTokenDTO {
    private String token;
    private Long userId;
}
