package com.example.swingback.healthcare.notificationtime.controller;

import com.example.swingback.error.CustomException;
import com.example.swingback.healthcare.notificationtime.dto.NotificationTimeDTO;
import com.example.swingback.healthcare.notificationtime.service.NotificationTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class NotificationTimeController {

    private final NotificationTimeService notificationTimeService;
    @PostMapping("/api/healthcare/notification")
    public ResponseEntity<?> saveBloodNotificationTime(@RequestBody NotificationTimeDTO notificationTimeDTO) {

        notificationTimeService.saveNotificationTime(notificationTimeDTO);

        return ResponseEntity.status(HttpStatus.OK).body("알림 시간 등록 성공");
    }

    @ExceptionHandler(CustomException.class) // 코드가 없을경우 400 에러 발생
    public ResponseEntity<String> handleUnauthorizedException(CustomException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
