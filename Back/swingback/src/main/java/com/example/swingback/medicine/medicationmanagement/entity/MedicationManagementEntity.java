package com.example.swingback.medicine.medicationmanagement.entity;

import com.example.swingback.medicine.medicinebag.entity.MedicineBagEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "medication_management")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class MedicationManagementEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medication_management_id")
    private Long medicationManagementId;

    @ManyToOne // 약봉투 id
    @JoinColumn(name = "medicine_bag_id", nullable = false)
    private MedicineBagEntity medicineBag;

    @Column(name = "notification_date")
    private LocalDate notificationDate; // 알림 날짜 (기간내의 날짜)

    @Column(name = "notification_time")
    private LocalTime notificationTime; // 알림 시간 (사용자가 설정한 알림 시간)

    @Column(name = "total_intake_confirmed", nullable = false) // 복용 확인
    private boolean totalIntakeConfirmed;

    @OneToMany(mappedBy = "medicationManagement", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // 순환 참조 방지
    private List<IntakeMedicineListEntity> medicineList;

    @Column(name = "type")
    private String type;

    @Column(name = "batch_check")
    private LocalDateTime batchCheckTime;

    public void setBatchCheckTime(LocalDateTime batchCheckTime) {
        this.batchCheckTime = batchCheckTime;
    }

    // 약 복용확인 위한 Setter 메서드 추가
    public void setIntakeConfirmed(boolean totalIntakeConfirmed) {
        this.totalIntakeConfirmed = totalIntakeConfirmed;
    }

}
