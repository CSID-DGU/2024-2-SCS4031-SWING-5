package com.example.swingback.healthcare.notificationtime.repository;

import com.example.swingback.healthcare.notificationtime.entity.NotificationTimeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationTimeRepository extends JpaRepository<NotificationTimeEntity,Long> {
}
