package com.example.swingback.reward.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.error.CustomException;
import com.example.swingback.reward.entity.RewardEntity;
import com.example.swingback.reward.repository.RewardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RewardService {

    private final RewardRepository rewardRepository;
    private final UserRepository userRepository;
    public Long getReward(Long userId) {
        UserEntity byUserId = userRepository.findByUserId(userId);
        List<RewardEntity> byUserId1 = rewardRepository.findByUserId(byUserId)
                .orElseThrow(() -> new CustomException("해당 회원의 포인트 내역이 존재하지 않습니다."));
        Long sum =0L;
        for (RewardEntity rewardEntity : byUserId1) {
            sum +=rewardEntity.getRewardPoint();
            log.info("rewardEntity.getRewardPoint() {}", rewardEntity.getRewardPoint());
        }
        return sum;
    }
}
