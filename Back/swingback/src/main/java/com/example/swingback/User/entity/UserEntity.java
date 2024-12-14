package com.example.swingback.User.entity;

import com.example.swingback.family.newcode.entity.FamilyEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder  // Builder 패턴 추가
@AllArgsConstructor
@Entity
@Getter
@NoArgsConstructor
@Table(name = "user")  // 테이블 이름 설정
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")  // 유저 고유 아이디 (PK)
    private Long userId;

    @Column(name = "provider_id",unique = true)
    private String providerId;

    @Column(name = "provider")
    private String provider;

    @Column(name = "role")
    private String role;

    @ManyToOne
    @JoinColumn(name = "family_id") // 가족 아이디 (FK)
    private FamilyEntity family;

    @Column(name = "family_role")  // 가족 구성원
    private String familyRole;

    @Column(name = "name")  // 이름
    private String name;

    @Column(name = "email")  // 이메일 , 가입용
    private String email;

    @Column(name = "phone_number")  // 연락처
    private String phoneNumber;

    @Column(name = "gender")  // 성별
    private String gender;

    @Column(name = "age")  // 나이
    private Long age;

    public void updateProfile(String nickname, String email, String role) {
        this.name = nickname;
        this.email = email;
        this.role = role;
    }

    public void updateFamily(FamilyEntity familyEntity) {
        this.family = familyEntity;
    }
}
