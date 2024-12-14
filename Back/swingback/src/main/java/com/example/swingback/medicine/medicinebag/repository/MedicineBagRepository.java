package com.example.swingback.medicine.medicinebag.repository;

import com.example.swingback.medicine.medicinebag.entity.MedicineBagEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.List;

@Repository
public interface MedicineBagRepository extends JpaRepository<MedicineBagEntity,Long> {
    
    // 날짜가 들어오면 해당하는 registrationdate와 enbdate의 사이의 해당하는지 확인하고 존재하면 MedicineBagEntity 리스트를 돌려줌
    @Query("SELECT m FROM MedicineBagEntity m WHERE m.userId.userId = :userId AND :date BETWEEN m.registrationDate AND m.endDate")
    List<MedicineBagEntity> findByUserIdAndDateBetween(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT c FROM MedicineBagEntity c WHERE " +
            "(YEAR(c.registrationDate) = :year AND MONTH(c.registrationDate) = :month) " +
            "OR (YEAR(c.endDate) = :year AND MONTH(c.endDate) = :month) " +
            "OR (c.registrationDate < :startOfMonth AND c.endDate >= :startOfMonth)")
    List<MedicineBagEntity> findEventsByMonth(@Param("year") int year,
                                     @Param("month") int month,
                                     @Param("startOfMonth") LocalDate startOfMonth);

}
