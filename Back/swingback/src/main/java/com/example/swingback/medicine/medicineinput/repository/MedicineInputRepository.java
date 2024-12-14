package com.example.swingback.medicine.medicineinput.repository;

import com.example.swingback.medicine.medicineinput.entity.MedicineInputEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineInputRepository extends JpaRepository<MedicineInputEntity,Long> {
}
