package com.example.swingback.medicine.medicinebag.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.calendar.common.BuilderCalendar;
import com.example.swingback.commons.NotificationType;
import com.example.swingback.error.CustomException;
import com.example.swingback.medicine.medicationmanagement.entity.IntakeMedicineListEntity;
import com.example.swingback.medicine.medicationmanagement.entity.MedicationManagementEntity;
import com.example.swingback.medicine.medicationmanagement.repository.IntakeMedicineListRepository;
import com.example.swingback.medicine.medicationmanagement.repository.MedicationManegementRepository;
import com.example.swingback.medicine.medicinebag.dto.MedicineBagDTO;
import com.example.swingback.medicine.medicinebag.entity.MedicineBagEntity;
import com.example.swingback.medicine.medicinebag.repository.MedicineBagRepository;
import com.example.swingback.medicine.medicineinput.dto.MedicineInputDTO;
import com.example.swingback.medicine.medicineinput.entity.MedicineInputEntity;
import com.example.swingback.notification.message.dto.MessageTemplateDTO;
import com.example.swingback.notification.message.service.MessageTemplateService;
import com.example.swingback.notification.total.service.TotalNotificationService;
import com.example.swingback.reward.repository.RewardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class Test {

    private final MedicineBagRepository medicineBagRepository;
    private final UserRepository userRepository;
    private final IntakeMedicineListRepository intakeMedicineListRepository;
    private final MedicationManegementRepository medicationManegementRepository;
    private final BuilderCalendar builderCalendar;
    private final MessageTemplateService messageTemplateService;
    private final TotalNotificationService totalNotificationService;
    private final RewardRepository rewardRepository;
    public void saveMedicineInputAndBag(MedicineBagDTO medicineBagDTO) {
        // 1. 사용자 유효성 검증
        UserEntity requestUserEntity = validateAndGetUser(medicineBagDTO.getUserId());

        // 2. MedicineBagEntity 생성
        MedicineBagEntity medicineBag = createMedicineBag(medicineBagDTO, requestUserEntity);

        // 3. MedicineInputEntity 리스트 생성 및 추가
        addMedicineInputsToBag(medicineBagDTO, medicineBag);

        // 4. 복약 관리 엔티티 생성 및 알림 설정
        createMedicationManagementAndNotifications(medicineBagDTO, medicineBag, requestUserEntity);

        // 5. MedicineBagEntity 저장
        medicineBagRepository.save(medicineBag);

        // 6. 캘린더 엔트리 생성
        builderCalendar.builderCalendarEntity(
                requestUserEntity,
                medicineBagDTO.getMedicineBagTitle(),
                medicineBagDTO.getRegistrationDate(),
                medicineBagDTO.getEndDate(),
                "medicine"
        );
    }

    //사용자 유효성 검증
    private UserEntity validateAndGetUser(Long userId) {
        UserEntity userEntity = userRepository.findByUserId(userId);
        if (userEntity == null) {
            throw new CustomException("유효하지 않은 사용자입니다. 요청한 사용자를 확인해주세요.");
        }
        return userEntity;
    }
    //MedicineBagEntity 생성
    private MedicineBagEntity createMedicineBag(MedicineBagDTO dto, UserEntity user) {
        return MedicineBagEntity.builder()
                .medicineBagTitle(dto.getMedicineBagTitle())
                .userId(user)
                .registrationDate(dto.getRegistrationDate())
                .endDate(dto.getEndDate())
                .hidden(dto.getHidden())
                .medicinesInput(new ArrayList<>())
                .medicationManagementEntities(new ArrayList<>())
                .morningTime(dto.getMorningTime())
                .lunchTime(dto.getLunchTime())
                .dinnerTime(dto.getDinnerTime())
                .beforeSleepTime(dto.getBeforeSleepTime())
                .type(dto.getType())
                .build();
    }
    //MedicineInputEntity 리스트 생성 및 추가
    private void addMedicineInputsToBag(MedicineBagDTO dto, MedicineBagEntity medicineBag) {
        for (MedicineInputDTO medicineDTO : dto.getMedicineList()) {
            MedicineInputEntity medicineInput = MedicineInputEntity.builder()
                    .medicineBag(medicineBag)
                    .medicineName(medicineDTO.getMedicineName())
                    .dosagePerIntake(medicineDTO.getDosagePerIntake())
                    .frequencyIntake(medicineDTO.getFrequencyIntake())
                    .durationIntake(medicineDTO.getDurationIntake())
                    .morningTimebox(medicineDTO.getMorningTimebox())
                    .lunchTimebox(medicineDTO.getLunchTimebox())
                    .dinnerTimebox(medicineDTO.getDinnerTimebox())
                    .beforeSleepTimebox(medicineDTO.getBeforeSleepTimebox())
                    .build();
            medicineBag.getMedicinesInput().add(medicineInput);
        }
    }
    //복약 관리 엔티티 생성 및 알림 설정
    private void createMedicationManagementAndNotifications(
            MedicineBagDTO dto,
            MedicineBagEntity medicineBag,
            UserEntity user
    ) {
        Map<String, LocalTime> notificationTimes = extractNotificationTimes(dto);
        LocalDate currentDate = dto.getRegistrationDate();

        while (!currentDate.isAfter(dto.getEndDate())) {
            for (Map.Entry<String, LocalTime> entry : notificationTimes.entrySet()) {
                String timeType = entry.getKey();
                LocalTime time = entry.getValue();
                if (time != null) {
                    createNotificationForTime(dto, medicineBag, user, currentDate, timeType, time);
                }
            }
            currentDate = currentDate.plusDays(1);
        }
    }
    //알림 시간 추출
    private Map<String, LocalTime> extractNotificationTimes(MedicineBagDTO dto) {
        Map<String, LocalTime> times = new HashMap<>();
        times.put("morning", dto.getMorningTime() != null ? dto.getMorningTime().toLocalTime() : null);
        times.put("lunch", dto.getLunchTime() != null ? dto.getLunchTime().toLocalTime() : null);
        times.put("dinner", dto.getDinnerTime() != null ? dto.getDinnerTime().toLocalTime() : null);
        times.put("beforeSleep", dto.getBeforeSleepTime() != null ? dto.getBeforeSleepTime().toLocalTime() : null);
        return times;
    }
    //알림 생성 로직
    private void createNotificationForTime(
            MedicineBagDTO dto,
            MedicineBagEntity medicineBag,
            UserEntity user,
            LocalDate date,
            String timeType,
            LocalTime time
    ) {
        MedicationManagementEntity managementEntity = createMedicationManagementEntity(dto, medicineBag, date, time);
        boolean hasMedicine = addMedicinesToManagement(dto, managementEntity, timeType);

        if (hasMedicine) {
            medicineBag.getMedicationManagementEntities().add(managementEntity);
//            scheduleNotification(dto, user, managementEntity, date, time);
            scheduleNotification(dto, user, date, time);
        }
    }
    //MedicationManagementEntity 생성
    private MedicationManagementEntity createMedicationManagementEntity(
            MedicineBagDTO dto,
            MedicineBagEntity bag,
            LocalDate date,
            LocalTime time
    ) {
        return MedicationManagementEntity.builder()
                .medicineBag(bag)
                .notificationDate(date)
                .notificationTime(time)
                .totalIntakeConfirmed(false)
                .medicineList(new ArrayList<>())
                .type(dto.getType())
                .build();
    }
    //약 리스트 추가 및 확인
    private boolean addMedicinesToManagement(
            MedicineBagDTO dto,
            MedicationManagementEntity managementEntity,
            String timeType
    ) {
        boolean hasMedicine = false;
        for (MedicineInputDTO medicineDTO : dto.getMedicineList()) {
            if (isMedicineScheduledForTime(medicineDTO, timeType)) {
                IntakeMedicineListEntity medicineList = IntakeMedicineListEntity.builder()
                        .medicationManagement(managementEntity)
                        .medicineName(medicineDTO.getMedicineName())
                        .dosagePerIntake(medicineDTO.getDosagePerIntake())
                        .intakeConfirmed(false)
                        .build();
                managementEntity.getMedicineList().add(medicineList);
                hasMedicine = true;
            }
        }
        return hasMedicine;
    }
    //
    private boolean isMedicineScheduledForTime(MedicineInputDTO medicineDTO, String timeType) {
        switch (timeType) {
            case "morning": return medicineDTO.getMorningTimebox();
            case "lunch": return medicineDTO.getLunchTimebox();
            case "dinner": return medicineDTO.getDinnerTimebox();
            case "beforeSleep": return medicineDTO.getBeforeSleepTimebox();
            default: return false;
        }
    }

    //알림 예약
    private void scheduleNotification(
            MedicineBagDTO dto,
            UserEntity user,
//            MedicationManagementEntity managementEntity,
            LocalDate date,
            LocalTime time
    ) {
        LocalDateTime notificationDateTime = LocalDateTime.of(date, time);
        if (!LocalDateTime.now().isAfter(notificationDateTime)) { // 현재시간 이전의 알람은 등록하지 않음
            MessageTemplateDTO messageTemplate = messageTemplateService.generateMessage(4L,
                    Map.of("medicine", dto.getMedicineBagTitle()));
            totalNotificationService.saveNotification(
                    NotificationType.MEDICATION_REMINDER.getDescription(),
                    user.getUserId(),
                    user,
                    false,
                    dto.getHidden(),
                    notificationDateTime,
                    null,
                    messageTemplate
            );
        }
    }






}
