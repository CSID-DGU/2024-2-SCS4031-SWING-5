package com.example.swingback.medicine.medicationmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "intake_medicine_list")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class IntakeMedicineListEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "intake_medicine_list_id")
    private Long intakeMedicineListId;

    @ManyToOne // 복약관리 테이블
    @JoinColumn(name = "medication_management_id", nullable = false)
    private MedicationManagementEntity medicationManagement;

    @Column(name = "medicine_name", nullable = false) // 약이름
    private String medicineName;

    @Column(name = "dosage_per_intake", nullable = false) // 약 1회 섭취량
    private int dosagePerIntake;

    @Column(name = "intake_confirmed", nullable = false) // 약 복용확인
    private boolean intakeConfirmed;

    // 약 복용확인 위한 Setter 메서드 추가
    public void setIntakeConfirmed(boolean intakeConfirmed) {
        this.intakeConfirmed = intakeConfirmed;
    }
}
