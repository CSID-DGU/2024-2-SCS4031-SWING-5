package com.example.swingback.notification.token.controller;

import com.example.swingback.error.CustomException;
import com.example.swingback.notification.token.dto.FCMTokenDTO;
import com.example.swingback.notification.token.service.FCMTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class FCMTokenController {

    private final FCMTokenService tokenService;
    @PostMapping("/api/save-token")
    public ResponseEntity<?> getCode(@RequestBody FCMTokenDTO fcmTokenDTO) {
        log.info("fcmTokenDTO.getToken() : " + fcmTokenDTO.getToken() +
                " fcmTokenDTO.getUserId() : " + fcmTokenDTO.getUserId());

        tokenService.tokenSave(fcmTokenDTO);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<String> handleUnauthorizedException(CustomException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }
}
