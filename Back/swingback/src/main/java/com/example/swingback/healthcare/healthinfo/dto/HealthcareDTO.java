package com.example.swingback.healthcare.healthinfo.dto;

import com.example.swingback.User.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
public class HealthcareDTO {

    private Long userId;
    private String type; // 데이터 종류(혈압, 혈당 등)
    private LocalDateTime registrationDate;
    private String measureTitle; // 세부 항목 (아침, 점심 등)
    private String keyName; // 측정 데이터 이름 (예: highpressure, lowpressure)
    private String keyValue; // 측정 데이터 값 (예: 120 mmHg, 80 mmHg)
}
