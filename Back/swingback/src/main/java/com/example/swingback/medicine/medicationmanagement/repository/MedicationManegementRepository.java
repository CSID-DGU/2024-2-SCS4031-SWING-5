package com.example.swingback.medicine.medicationmanagement.repository;

import com.example.swingback.medicine.medicationmanagement.entity.MedicationManagementEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface MedicationManegementRepository extends JpaRepository<MedicationManagementEntity,Long> {

//    @Query("SELECT m FROM MedicationManagementEntity m " +
//            "WHERE m.totalIntakeConfirmed = false " +
//            "AND (m.notificationDate < :currentDate " +
//            "OR (m.notificationDate = :currentDate AND m.notificationTime < :currentTime))")
//    List<MedicationManagementEntity> findPastUnconfirmedMedications(
//            @Param("currentDate") LocalDate currentDate,
//            @Param("currentTime") LocalTime currentTime
//    );

    @Query("SELECT m FROM MedicationManagementEntity m " +
            "WHERE m.totalIntakeConfirmed = false " +
            "AND (m.notificationDate < :currentDate " +
            "OR (m.notificationDate = :currentDate AND m.notificationTime < :currentTime))")
    Page<MedicationManagementEntity> findPastUnconfirmedMedications(
            @Param("currentDate") LocalDate currentDate,
            @Param("currentTime") LocalTime currentTime,
            Pageable pageable
    );

}
