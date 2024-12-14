package com.example.swingback.family.newcode.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.error.CustomException;
import com.example.swingback.family.newcode.DTO.NewCodeDTO;
import com.example.swingback.family.newcode.entity.FamilyEntity;
import com.example.swingback.family.newcode.repository.FamilyRepository;
import com.example.swingback.oauth.dto.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FamilyNewCodeServivce {

    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    public NewCodeDTO findByCodMyFamily() {

        //SecurityContextHolder를 통해 현재 인증된 사용자의 정보를 Authentication에 생성
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //인증된 사용자가 아니면 에러띄워주기
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException("인증되지 않은 회원입니다");
        }

        // 현재 인증된 사용자의 providerId를 가져옴
        CustomOAuth2User userDetails = (CustomOAuth2User) authentication.getPrincipal();

        String providerId = userDetails.getProviderId(); // CustomOAuth2User에서 providerId를 가져온다고 가정

        //해당 providerId DB에 접근해서 UserEntity정보를 가져옴
        UserEntity user = userRepository.findByProviderId(providerId);
        log.info("NewCodeService of user.getFamilyRole : " + user.getFamilyRole());

        if (user.getFamily() != null) { // 기존에 만들어 놨던 가족 테이블이 존재할 경우
            return new NewCodeDTO(user.getFamily().getFamilyId(),null);
        } else { // 처음 가족을 만드는 회원일 경우
            /*
            UUID.randomUUID()로 생성된 "123e4567-e89b-12d3-a456-426614174000"코드들을
            .replaceAll("-", "")를 이용해서 -를 다 떼어냄
            .substring(0, 6)를 통해서 처음 6글자 추출함
            */
            String randomCode = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 6);
            //가족 엔티티 생성함
            FamilyEntity familyEntity = FamilyEntity.builder()
                    .familyId(randomCode)
                    .familyRepresentative(user.getUserId())
                    .familyCreateDate(new Date())
                    .users(new ArrayList<>()) // users 리스트 초기화
                    .build();

            familyEntity.getUsers().add(user); // FamilyEntity에 사용자 추가
            familyRepository.save(familyEntity); // FamilyEntity를 먼저 저장

            user.updateFamily(familyEntity); // FamilyEntity가 저장된 후에 UserEntity에 설정
            userRepository.save(user); // UserEntity를 저장
            return new NewCodeDTO(null,randomCode);
        }

    }

    public String findFamilyCodeByUserId(Long userId) {
        UserEntity byUserId = userRepository.findByUserId(userId);
        if (byUserId.getFamily() == null) {
            return "N"; // 가입된 가족이 없을 경우
        } else {
            return byUserId.getFamily().getFamilyId(); // 가입된 가족이 있을 경우
        }
    }
}
