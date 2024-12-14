package com.example.swingback.notification.total.repository;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.notification.total.entity.TotalNotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<TotalNotificationEntity,Long> {

    // sendTime을 기준으로 가장 최근 순으로 상위 10개를 가져오는 메서드
    List<TotalNotificationEntity> findTop10ByResponseIdOrderBySendTimeDesc(UserEntity responseId);

    //

}
