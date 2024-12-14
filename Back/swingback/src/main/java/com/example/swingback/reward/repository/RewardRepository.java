package com.example.swingback.reward.repository;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.reward.entity.RewardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RewardRepository extends JpaRepository<RewardEntity, Long> {
    Optional<List<RewardEntity>> findByUserId(UserEntity userId);
}
