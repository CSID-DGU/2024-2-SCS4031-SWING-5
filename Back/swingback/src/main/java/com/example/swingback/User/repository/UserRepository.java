package com.example.swingback.User.repository;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.family.newcode.entity.FamilyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long> {
    UserEntity findByProviderId(String providerId);

    UserEntity findByUserId(Long userId);

    List<UserEntity> findByFamily(FamilyEntity family_id);

}
