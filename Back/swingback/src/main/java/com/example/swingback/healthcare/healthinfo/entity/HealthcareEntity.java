package com.example.swingback.healthcare.healthinfo.entity;

import com.example.swingback.User.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "healthcare")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class HealthcareEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "healthcare_id")
    private Long headthcareId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userId;

    @Column(name = "type")
    private String type; // 데이터 종류(혈압, 혈당 등)

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "measure_title")
    private String measureTitle; // 세부 항목 (아침, 점심 등)

    @Column(name = "key_name")
    private String keyName; // 측정 데이터 이름 (예: highpressure, lowpressure)

    @Column(name = "key_value")
    private String keyValue; // 측정 데이터 값 (예: 120 mmHg, 80 mmHg)

}
