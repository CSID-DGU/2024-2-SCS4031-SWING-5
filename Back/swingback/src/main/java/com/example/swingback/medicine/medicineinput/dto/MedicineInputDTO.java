package com.example.swingback.medicine.medicineinput.dto;

import lombok.Getter;

@Getter
public class MedicineInputDTO {
    private String medicineName;         // 약 이름
    private int dosagePerIntake;         // 1회 섭취량
    private int frequencyIntake;         // 하루 섭취 횟수
    private int durationIntake;          // 섭취 기간
    private Boolean morningTimebox;      // 아침 복용 여부
    private Boolean lunchTimebox;        // 점심 복용 여부
    private Boolean dinnerTimebox;       // 저녁 복용 여부
    private Boolean beforeSleepTimebox;  // 자기 전 복용 여부
    private Boolean intakeConfirmed;     // 복용 확인 여부

}
