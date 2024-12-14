package com.example.swingback.healthcare.healthinfo.repository;

import com.example.swingback.healthcare.healthinfo.entity.HealthcareEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HealthcareRepository extends JpaRepository<HealthcareEntity,Long> {


    @Query("SELECT h FROM HealthcareEntity h " +
            "WHERE h.userId.userId = :userId " +
            "AND h.registrationDate >= :startOfDay " +
            "AND h.registrationDate <= :endOfDay")
    List<HealthcareEntity> findByUserIdAndRegistrationDateBetween(Long userId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
