package com.example.swingback.family.newcode.repository;

import com.example.swingback.family.newcode.entity.FamilyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FamilyRepository extends JpaRepository<FamilyEntity,String> {
    Optional<FamilyEntity> findByFamilyId(String familyId);

    FamilyEntity findByFamilyRepresentative(Long RepresentativeId);
}
