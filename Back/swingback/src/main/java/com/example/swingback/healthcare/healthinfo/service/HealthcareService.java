package com.example.swingback.healthcare.healthinfo.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.calendar.common.BuilderCalendar;
import com.example.swingback.error.CustomException;
import com.example.swingback.healthcare.healthinfo.dto.HealthcareDTO;
import com.example.swingback.healthcare.healthinfo.entity.HealthcareEntity;
import com.example.swingback.healthcare.healthinfo.repository.HealthcareRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthcareService {

    private final HealthcareRepository healthcareRepository;
    private final UserRepository userRepository;
    private final BuilderCalendar builderCalendar;


    public String saveHealthcare(List<HealthcareDTO> healthcareDTO) {
        for (HealthcareDTO healthDTO : healthcareDTO) {
            //요청을 보내는 회원의 회원정보 가져오기
            UserEntity requestUserEntity =
                    userRepository.findByUserId(healthDTO.getUserId());
            // 요청한 사용자 ID가 유효한지 확인
            if (requestUserEntity == null) {
                throw new CustomException("유효하지 않은 사용자입니다. 요청한 사용자를 확인해주세요.");
            }
            HealthcareEntity healthcareEntity = HealthcareEntity.builder()
                    .userId(requestUserEntity)
                    .measureTitle(healthDTO.getMeasureTitle())
                    .type(healthDTO.getType())
                    .keyName(healthDTO.getKeyName())
                    .keyValue(healthDTO.getKeyValue())
                    .registrationDate(healthDTO.getRegistrationDate())
                    .endDate(healthDTO.getRegistrationDate())
                    .build();
            healthcareRepository.save(healthcareEntity);

            builderCalendar.
                    builderCalendarEntity(
                            requestUserEntity,
                            healthDTO.getType(),
                            healthDTO.getRegistrationDate().toLocalDate(),
                            healthDTO.getRegistrationDate().toLocalDate(),
                            healthDTO.getType());
        }
        return "등록 성공";

    }
}
