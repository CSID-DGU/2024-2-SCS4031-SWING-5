package com.example.swingback.medicine.medicationmanagement.repository;

import com.example.swingback.medicine.medicationmanagement.entity.IntakeMedicineListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IntakeMedicineListRepository extends JpaRepository<IntakeMedicineListEntity,Long> {
}
