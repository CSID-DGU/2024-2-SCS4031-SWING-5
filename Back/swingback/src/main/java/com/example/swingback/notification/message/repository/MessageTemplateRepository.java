package com.example.swingback.notification.message.repository;

import com.example.swingback.notification.message.entity.MessageTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageTemplateRepository extends JpaRepository<MessageTemplateEntity,Long> {
}
