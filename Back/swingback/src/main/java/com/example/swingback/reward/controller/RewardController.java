package com.example.swingback.reward.controller;

import com.example.swingback.error.CustomException;
import com.example.swingback.reward.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;
    @GetMapping("/api/reward/{userId}")
    public ResponseEntity<Long> getTotalReward(@PathVariable Long userId) {

        Long reward = rewardService.getReward(userId);
        return (reward != null) ?
                ResponseEntity.status(HttpStatus.OK).body(reward) :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @ExceptionHandler(CustomException.class) // 코드가 없을경우 400 에러 발생
    public ResponseEntity<String> handleUnauthorizedException(CustomException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
