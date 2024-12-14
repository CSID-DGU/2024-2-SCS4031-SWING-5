package com.example.swingback.notification.token.repository;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.notification.token.entity.FCMTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FCMTokenRepository extends JpaRepository<FCMTokenEntity,Long> {
    Optional<FCMTokenEntity> findByTokenAndUserId(String token, UserEntity userId);

    List<FCMTokenEntity> findAllByUserId(UserEntity UserId);

}
