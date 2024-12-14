package com.example.swingback.medicine.medicationmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class IntakeMedicineListDTO {

    private Long intakeMedicineListId;
    private String medicineName;
    private int dosagePerIntake;
    private boolean intakeConfirmed;
}
