package com.example.swingback.medicine.medicineinput.entity;

import com.example.swingback.medicine.medicinebag.entity.MedicineBagEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "medicine_input")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineInputEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registered_medicine_id")
    private Long registeredMedicineId;

    @ManyToOne // 약봉투 id
    @JoinColumn(name = "medicine_bag_id", nullable = false)
    private MedicineBagEntity medicineBag;

    @Column(name = "medicine_name", nullable = false) // 약이름
    private String medicineName;

    @Column(name = "dosage_per_intake", nullable = false) // 약 1회 섭취량
    private int dosagePerIntake;

    @Column(name = "frequency_intake", nullable = false) // 하루 섭취 횟수
    private int frequencyIntake;

    @Column(name = "duration_intake", nullable = false) // 섭취 기간
    private int durationIntake;

    @Column(name = "morning_timebox", nullable = false) // 아침 복용 여부
    private boolean morningTimebox;

    @Column(name = "lunch_timebox", nullable = false) // 점심 복용 여부
    private boolean lunchTimebox;

    @Column(name = "dinner_timebox", nullable = false) // 저녁 복용 여부
    private boolean dinnerTimebox;

    @Column(name = "beforeSleep_timebox", nullable = false)// 자기전 복용 여부
    private boolean beforeSleepTimebox;

//    @Column(name = "intake_confirmed", nullable = false) // 약 복용확인
//    private boolean intakeConfirmed;

}
