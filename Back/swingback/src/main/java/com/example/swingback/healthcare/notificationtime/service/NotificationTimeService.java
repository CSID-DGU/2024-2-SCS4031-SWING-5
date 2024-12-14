package com.example.swingback.healthcare.notificationtime.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.error.CustomException;
import com.example.swingback.healthcare.notificationtime.dto.NotificationTimeDTO;
import com.example.swingback.healthcare.notificationtime.entity.NotificationTimeEntity;
import com.example.swingback.healthcare.notificationtime.repository.NotificationTimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationTimeService {

    private final NotificationTimeRepository notificationTimeRepository;
    private final UserRepository userRepository;
    public void saveNotificationTime(NotificationTimeDTO notificationTimeDTO) {
        UserEntity byUserId = userRepository.findByUserId(notificationTimeDTO.getUserId());
        if (byUserId == null) {
            throw new CustomException("해당 아이디의 유저를 찾을 수 없습니다.");
        }

        List<LocalTime> scheduleTimeDTO = notificationTimeDTO.getScheduleTimeList();
        for (LocalTime localTime : scheduleTimeDTO) {
            NotificationTimeEntity notificationTime = NotificationTimeEntity.builder()
                    .scheduleTime(localTime)
                    .type(notificationTimeDTO.getType())
                    .userId(byUserId)
                    .notificationRegisterTime(null)
                    .build();
            notificationTimeRepository.save(notificationTime);
        }
    }
}
