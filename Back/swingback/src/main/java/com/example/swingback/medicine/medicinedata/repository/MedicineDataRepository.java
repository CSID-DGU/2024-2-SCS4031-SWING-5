package com.example.swingback.medicine.medicinedata.repository;

import com.example.swingback.medicine.medicinedata.entity.MedicineDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineDataRepository extends JpaRepository<MedicineDataEntity,Long> {
//    @Query(value = "SELECT * FROM medicine_data " +
//            "WHERE MATCH(medicine_name) AGAINST(:keyword IN NATURAL LANGUAGE MODE)",
//            nativeQuery = true)
//    List<MedicineDataEntity> searchByMedicineName(@Param("keyword") String keyword);
@Query(value = "SELECT * FROM medicine_data WHERE medicine_name LIKE %:keyword%", nativeQuery = true)
List<MedicineDataEntity> searchByMedicineName(@Param("keyword") String keyword);

}
