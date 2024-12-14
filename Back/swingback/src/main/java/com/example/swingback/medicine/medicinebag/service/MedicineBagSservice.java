package com.example.swingback.medicine.medicinebag.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.calendar.common.BuilderCalendar;
import com.example.swingback.calendar.entity.CalendarEntity;
import com.example.swingback.calendar.repository.CalendarRepository;
import com.example.swingback.commons.NotificationType;
import com.example.swingback.error.CustomException;
import com.example.swingback.medicine.medicationmanagement.dto.IntakeMedicineListDTO;
import com.example.swingback.medicine.medicationmanagement.dto.MedicationManagementDTO;
import com.example.swingback.medicine.medicationmanagement.entity.IntakeMedicineListEntity;
import com.example.swingback.medicine.medicationmanagement.entity.MedicationManagementEntity;
import com.example.swingback.medicine.medicationmanagement.repository.IntakeMedicineListRepository;
import com.example.swingback.medicine.medicationmanagement.repository.MedicationManegementRepository;
import com.example.swingback.medicine.medicinebag.dto.MedicineBagDTO;
import com.example.swingback.medicine.medicineinput.dto.MedicineInputDTO;
import com.example.swingback.medicine.medicinebag.entity.MedicineBagEntity;
import com.example.swingback.medicine.medicinebag.repository.MedicineBagRepository;
import com.example.swingback.medicine.medicineinput.entity.MedicineInputEntity;
import com.example.swingback.notification.message.dto.MessageTemplateDTO;
import com.example.swingback.notification.message.service.MessageTemplateService;
import com.example.swingback.notification.total.service.TotalNotificationService;
import com.example.swingback.reward.entity.RewardEntity;
import com.example.swingback.reward.repository.RewardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicineBagSservice {

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
                medicineBag.getEndDate(),
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
        // 아침,점심,저녁 , 자기전에 맞는 시간을 dto를 이용해서 생성
        Map<String, LocalTime> notificationTimes = extractNotificationTimes(dto);
        LocalDate currentDate = dto.getRegistrationDate();

        if (currentDate.isBefore(LocalDate.now())) { // 시작 시간이 현재 시간보다 과거면 안에 로직 실행
            while (!currentDate.isAfter(dto.getEndDate())) { // 시작날짜와 끝나는 날짜까지 하루를 더해가면서 로직실행
                for (Map.Entry<String, LocalTime> entry : notificationTimes.entrySet()) {
                    String timeType = entry.getKey(); //map에 저장된 알림날짜에대한 로직 저장하기
                    LocalTime time = entry.getValue();
                    if (time != null) { // 알림시간이 존재한다면 다음 로직 실행
                        createNotificationForTime(dto, medicineBag, user, currentDate, timeType, time);
                    }
                }
                currentDate = currentDate.plusDays(1);
            }
        } else {
            while (!currentDate.isAfter(dto.getEndDate())) {

                for (Map.Entry<String, LocalTime> entry : notificationTimes.entrySet()) {
                    String timeType = entry.getKey();
                    LocalTime time = entry.getValue();
                    if (time != null) {
                        // 당일 등록기준 , 현재시간보다 과거의 알림이 존재하면 if문 실행
                        if (currentDate.atTime(time).isBefore(LocalDateTime.now())) { 
                            // MedicineBagEntity의 endDate를 수정, 캘린더와 약데이터 보내주는거 수정위해서 추가
                            medicineBag.setEndDate(dto.getEndDate().plusDays(1));
                            

                            createNotificationForTime(
                                    dto,
                                    medicineBag,
                                    user,
                                    dto.getEndDate().plusDays(1), // 수정된 날짜 사용
                                    timeType,
                                    time
                            );
                        } else {
                            createNotificationForTime(dto, medicineBag, user, currentDate, timeType, time);
                        }

                    }
                }
                currentDate = currentDate.plusDays(1);
            }
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
                .batchCheckTime(null)
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
        if (!LocalDateTime.now().isAfter(notificationDateTime)) {
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


    public List<MedicationManagementDTO> findMedicineBagInfo(Long userId, LocalDate date) {
        //요청을 보내는 회원의 회원정보 가져오기
        UserEntity requestUserEntity =
                userRepository.findByUserId(userId);
        // 요청한 사용자 ID가 유효한지 확인
        if (requestUserEntity == null) {
            throw new CustomException("유효하지 않은 사용자입니다. 요청한 사용자를 확인해주세요.");
        }
        List<MedicineBagEntity> byUserIdAndDateBetween = medicineBagRepository.findByUserIdAndDateBetween(userId, date);
        // 등록된 약봉투 데이터가 없는 경우 null 반환
        if (byUserIdAndDateBetween.isEmpty()) {
            log.info("No medicine bags found for userId: {} and date: {}", userId, date);
            throw new CustomException("해당 날짜의 약 정보가 존재하지 않습니다");
        }
        List<MedicationManagementDTO> medicationManagementDTOS = new ArrayList<>();
        for (MedicineBagEntity medicineBag : byUserIdAndDateBetween) {
            for (MedicationManagementEntity medicationManagementEntity : medicineBag.getMedicationManagementEntities()) {
                if (medicationManagementEntity.getNotificationDate().isEqual(date)) {
                    // 변환 작업
                    List<IntakeMedicineListDTO> intakeMedicineListDTOs = medicationManagementEntity.getMedicineList().stream()
                            .map(intakeMedicineListEntity -> IntakeMedicineListDTO.builder()
                                    .intakeMedicineListId(intakeMedicineListEntity.getIntakeMedicineListId())
                                    .medicineName(intakeMedicineListEntity.getMedicineName())
                                    .dosagePerIntake(intakeMedicineListEntity.getDosagePerIntake())
                                    .intakeConfirmed(intakeMedicineListEntity.isIntakeConfirmed())
                                    .build())
                            .collect(Collectors.toList());

                    // DTO 빌드
                    MedicationManagementDTO addList = MedicationManagementDTO.builder()
                            .medicineBagId(medicineBag.getMedicineBagId())
                            .MedicationManagementId(medicationManagementEntity.getMedicationManagementId())
                            .medicineBagName(medicineBag.getMedicineBagTitle())
                            .notificationDate(medicationManagementEntity.getNotificationDate())
                            .notificationTime(medicationManagementEntity.getNotificationTime())
                            .totalIntakeConfirmed(medicationManagementEntity.isTotalIntakeConfirmed())
                            .hidden(medicineBag.isHidden())
                            .medicineList(intakeMedicineListDTOs)
                            .type(medicineBag.getType())
                            .build();

                    medicationManagementDTOS.add(addList);
                }
            }
        }
        // 데이터 보내기전에 시간순으로 정렬하기
        medicationManagementDTOS.sort(Comparator.comparing(MedicationManagementDTO::getNotificationTime));

        for (MedicationManagementDTO medicationManagementDTO : medicationManagementDTOS) {
            log.info("MedicationManagementId: {}", medicationManagementDTO.getMedicationManagementId());
            log.info("medicineBagId: {}", medicationManagementDTO.getMedicineBagId());
            log.info("medicineBagName: {}", medicationManagementDTO.getMedicineBagName());
            log.info("medicineList: {}", medicationManagementDTO.getMedicineList());
            log.info("notificationTime: {}", medicationManagementDTO.getNotificationTime());
            log.info("notificationDate: {}", medicationManagementDTO.getNotificationDate());
            log.info("totalIntakeConfirmed: {}", medicationManagementDTO.isTotalIntakeConfirmed());
            log.info("hidden: {}", medicationManagementDTO.isHidden());

        }

    return medicationManagementDTOS;
    }

    public void updateIntakeMedicineListIntakeConfirmed(Long intakeMedicineListId, boolean intakeConfirmed) {
        IntakeMedicineListEntity byId = intakeMedicineListRepository.findById(intakeMedicineListId)
                .orElseThrow(() ->new CustomException("유효하지 않은 복약정보입니다."));
        byId.setIntakeConfirmed(intakeConfirmed);
        intakeMedicineListRepository.save(byId);
    }

    public String updateAllIntakeConfirmed(Long medicationManagementId) {
        MedicationManagementEntity medicationManagement = medicationManegementRepository.findById(medicationManagementId)
                .orElseThrow(() -> new CustomException("유효하지 않은 복약관리 정보입니다."));


        UserEntity byUserId = userRepository.findByUserId(medicationManagement.getMedicineBag().getUserId().getUserId());
        if (byUserId == null) {
            throw new CustomException("해당 회원이 존재하지 않습니다");
        }
        // 변경 전 상태 추적
        boolean wasTotalIntakeConfirmed = medicationManagement.isTotalIntakeConfirmed();

        // 모든 약의 intakeConfirmed를 true로 설정
        for (IntakeMedicineListEntity medicine : medicationManagement.getMedicineList()) {
            medicine.setIntakeConfirmed(true);
        }

        // totalIntakeConfirmed를 true로 설정
        medicationManagement.setIntakeConfirmed(true);

        medicationManegementRepository.save(medicationManagement);

        // 변경 감지 및 보상 로직
        if (!wasTotalIntakeConfirmed && medicationManagement.isTotalIntakeConfirmed()) {
            // 보상 생성
            RewardEntity reward = RewardEntity.builder()
                    .userId(byUserId)
                    .rewardPoint(100L) // 예: 100 포인트 부여
                    .rewardDate(LocalDateTime.now())
                    .acquisition_type("TotalIntakeConfirmed, " +" medicationManagementId : "+ medicationManagementId)
                    .build();

            // Reward 저장
            rewardRepository.save(reward);
            return "100포인트 적립";
        }
        return null;
    }
}
