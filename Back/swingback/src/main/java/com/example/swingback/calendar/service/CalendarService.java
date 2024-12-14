package com.example.swingback.calendar.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.calendar.dto.CalendarDTO;
import com.example.swingback.calendar.dto.TargetMonthDTO;
import com.example.swingback.calendar.entity.CalendarEntity;
import com.example.swingback.calendar.repository.CalendarRepository;
import com.example.swingback.error.CustomException;
import com.example.swingback.healthcare.healthinfo.dto.MeasurementByTypeDTO;
import com.example.swingback.healthcare.healthinfo.dto.MeasurementDetailDTO;
import com.example.swingback.healthcare.healthinfo.entity.HealthcareEntity;
import com.example.swingback.healthcare.healthinfo.repository.HealthcareRepository;
import com.sun.tools.jconsole.JConsoleContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
@Slf4j
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final UserRepository userRepository;
    private final HealthcareRepository healthcareRepository;
    public List<CalendarDTO> findCalendarInfo(Long userId, String date) {
        //요청을 보내는 회원의 회원정보 가져오기
        UserEntity requestUserEntity =
                userRepository.findByUserId(userId);
        // 요청한 사용자 ID가 유효한지 확인
        if (requestUserEntity == null) {
            throw new CustomException("유효하지 않은 사용자입니다. 요청한 사용자를 확인해주세요.");
        }
        //캘린더 테이블에서 일정가져옴
        List<CalendarEntity> calendarEntity = calendarRepository.findByUserIdAndDisplayDate(requestUserEntity, date)
                .orElseThrow(() -> new CustomException("해당 일정이 존재하지 않음"));

        log.info("calendarEntity : {}",calendarEntity.toString());

        List<CalendarDTO> calendarDTOS = new ArrayList<>();
        for (CalendarEntity entity : calendarEntity) {
            List<TargetMonthDTO> targetMonthDTO = entity.getTargetMonthList().stream()
                    .map(targetMonthEntity -> TargetMonthDTO.builder()
                            .targetMonthId(targetMonthEntity.getTargetMonthId())
                            .targetMonth(targetMonthEntity.getTargetMonth())
                            .build())
                    .toList();
            CalendarDTO calendarDTO = CalendarDTO.builder()
                    .calendarTitle(entity.getCalendarTitle())
                    .calendarId(entity.getCalendarId())
                    .calendarTargetCode(entity.getCalendarTargetCode())
                    .startDate(entity.getStartDate())
                    .endDate(entity.getEndDate())
                    .target(targetMonthDTO)
                    .displayDate(date)
                    .build();
            calendarDTOS.add(calendarDTO);
        }

        return calendarDTOS;
    }

    public List<MeasurementByTypeDTO> getMeasurementsGroupedByType(Long userId, LocalDate date) {
        // 시작 및 종료 시간 생성
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        // 데이터 조회
        List<HealthcareEntity> measurements = healthcareRepository.findByUserIdAndRegistrationDateBetween(userId, startOfDay, endOfDay);

        // 데이터를 type별로 그룹화
        Map<String, List<MeasurementDetailDTO>> groupedData = new HashMap<>();
        for (HealthcareEntity measurement : measurements) {
            String type = measurement.getType();
            groupedData.putIfAbsent(type, new ArrayList<>());

            // 해당 type에 이미 있는 DTO 찾기
            MeasurementDetailDTO existingDTO = groupedData.get(type).stream()
                    .filter(dto -> dto.getRegistrationDate().equals(measurement.getRegistrationDate()) &&
                            dto.getMeasureTitle().equals(measurement.getMeasureTitle()))
                    .findFirst()
                    .orElse(null);

            // 새 DTO 생성
            if (existingDTO == null) {
                MeasurementDetailDTO newDTO = MeasurementDetailDTO.builder()
                        .registrationDate(measurement.getRegistrationDate())
                        .measureTitle(measurement.getMeasureTitle())
                        .keyValues(new HashMap<>())
                        .build();
                newDTO.getKeyValues().put(measurement.getKeyName(), measurement.getKeyValue());
                groupedData.get(type).add(newDTO);
            } else {
                // 기존 DTO에 추가
                existingDTO.getKeyValues().put(measurement.getKeyName(), measurement.getKeyValue());
            }
        }

        // 그룹화된 데이터를 DTO로 변환
        List<MeasurementByTypeDTO> result = new ArrayList<>();
        for (Map.Entry<String, List<MeasurementDetailDTO>> entry : groupedData.entrySet()) {
            result.add(MeasurementByTypeDTO.builder()
                    .type(entry.getKey())
                    .measurements(entry.getValue())
                    .build());
        }

        return result;
    }
}
