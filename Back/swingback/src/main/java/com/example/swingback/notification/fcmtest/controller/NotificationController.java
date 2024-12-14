package com.example.swingback.notification.fcmtest.controller;

import com.example.swingback.notification.fcmtest.dto.NotificationRequestDTO;
import com.example.swingback.notification.fcmtest.service.FCMService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final FCMService fcmService;

    @PostMapping("/api/send-notification")
    public void sendNotification(@RequestBody NotificationRequestDTO request) {
        log.info("요청이 들어왔습니다.");
        fcmService.sendNotification(request.getToken(), request.getTitle(), request.getBody());
    }
}

