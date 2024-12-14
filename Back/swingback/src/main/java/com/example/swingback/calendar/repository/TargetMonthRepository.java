package com.example.swingback.calendar.repository;

import com.example.swingback.calendar.entity.TargetMonthEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TargetMonthRepository extends JpaRepository<TargetMonthEntity,Long> {
}
