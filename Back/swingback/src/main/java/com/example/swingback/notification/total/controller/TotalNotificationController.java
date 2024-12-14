package com.example.swingback.notification.total.controller;

import com.example.swingback.error.CustomException;
import com.example.swingback.notification.total.DTO.NotificationTableDTO;
import com.example.swingback.notification.total.service.TotalNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TotalNotificationController {

    private final TotalNotificationService totalNotificationService;
    @GetMapping("/api/notification")
    public ResponseEntity<?> getNotification(@RequestParam Long userId) {
        List<NotificationTableDTO> list
                = totalNotificationService.getNotificationTable(userId);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    @PostMapping("/api/notification")
    public ResponseEntity<?> readButton(@RequestBody Map<String, Long> request) {
        // 요청 데이터에서 "notificationId" 값 추출
        Long notificationId = request.get("notificationId");
        log.info("notificationId : {}",notificationId);
        totalNotificationService.readButtonClick(notificationId);
        return ResponseEntity.status(HttpStatus.OK).body("읽음 처리 완료");
    }


    @ExceptionHandler(CustomException.class) // 코드가 없을경우 400 에러 발생
    public ResponseEntity<String> handleUnauthorizedException(CustomException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

}
