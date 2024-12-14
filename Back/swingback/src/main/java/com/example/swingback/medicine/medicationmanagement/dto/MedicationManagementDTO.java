package com.example.swingback.medicine.medicationmanagement.dto;

import com.example.swingback.medicine.medicationmanagement.entity.IntakeMedicineListEntity;
import com.example.swingback.medicine.medicinebag.entity.MedicineBagEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MedicationManagementDTO {

    private Long medicineBagId;
    private Long MedicationManagementId;
    private String medicineBagName; // 약 봉투 이름
    private LocalDate notificationDate; // 알림 날짜 (기간내의 날짜)
    private LocalTime notificationTime; // 알림 시간 (사용자가 설정한 알림 시간)
    private boolean totalIntakeConfirmed; // 모두 복용 버튼 확인용
    private boolean hidden;// 가족에게 숨길지 여부
    private List<IntakeMedicineListDTO> medicineList;
    private String type;
}
