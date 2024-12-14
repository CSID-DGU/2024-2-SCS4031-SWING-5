package com.example.swingback.medicine.medicinedata.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "medicine_data")
@Getter
@Setter
public class MedicineDataEntity {

    @Id
    @Column(name = "product_code", nullable = false)
    private Long productCode;

    @Column(name = "medicine_name", length = 255)
    private String medicineName;

    @Column(name = "image", length = 255)
    private String image;

    @Column(name = "company_name", length = 255)
    private String companyName;

    @Column(name = "category_type", length = 255)
    private String categoryType;

    @Column(name = "efficacy", columnDefinition = "TEXT")
    @Lob
    private String efficacy;

    //columnDefinition = "TEXT" 이거 추가해서 65535보다 커서 Hibernate 동기화 안되는거 수정함
    @Column(name = "usage_method", columnDefinition = "TEXT")
    @Lob
    private String usageMethod;

}
