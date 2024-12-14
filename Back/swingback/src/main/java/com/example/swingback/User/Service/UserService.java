package com.example.swingback.User.Service;


import com.example.swingback.User.dto.UserData;
import com.example.swingback.User.dto.UserExtraInfoDTO;
import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.error.CustomException;
import com.example.swingback.oauth.dto.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserData findByProvider() {
        //SecurityContextHolder를 통해 현재 인증된 사용자의 정보를 Authentication에 생성
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("authentication : " + authentication);

        //인증정보가 있고 인증된 사용자라면 if문 내용실행
        if (authentication != null && authentication.isAuthenticated()) {
            // 현재 인증된 사용자의 providerId를 가져옴
            CustomOAuth2User userDetails = (CustomOAuth2User) authentication.getPrincipal();

            String providerId = userDetails.getProviderId(); // CustomOAuth2User에서 providerId를 가져온다고 가정

            //해당 providerId DB에 접근해서 UserEntity정보를 가져옴
            UserEntity user = userRepository.findByProviderId(providerId);
            log.info("user.getFamilyRole : " + user.getFamilyRole());

            //해당 유저의 Name과 FamilyRole 객체를 생성해서 리턴해줌
            return new UserData(user.getName(), user.getFamilyRole(),user.getUserId());

        }
        //if문을 실행하지 못하였을 경우
        return null;
    }

    //프론트에서 받아온 추가정보를 이용해서 기존 사용자 정보 업데이트하는 코드
    public String getExtraInfo(UserExtraInfoDTO userExtraInfoDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("authentication : " + authentication);
        if (authentication != null && authentication.isAuthenticated()) {
            // 현재 인증된 사용자의 providerId를 가져옴
            CustomOAuth2User userDetails = (CustomOAuth2User) authentication.getPrincipal();
            if (userDetails==null) {
                throw new CustomException("권한이 없습니다. 잘못된 사용자 요청입니다.");
            }
            String providerId = userDetails.getProviderId(); // CustomOAuth2User에서 providerId를 가져온다고 가정
            UserEntity existingUser = userRepository.findByProviderId(providerId);

            if (existingUser != null) {
                // 기존 값을 유지하면서 업데이트할 값만 변경하여 새로운 객체를 빌드
                UserEntity updatedUser = UserEntity.builder()
                        .userId(existingUser.getUserId())  // 기존 userId 유지
                        .name(existingUser.getName())      // 기존 name 유지
                        .email(existingUser.getEmail())    // 기존 email 유지
                        .provider(existingUser.getProvider())  // 기존 provider 유지
                        .providerId(existingUser.getProviderId())  // 기존 providerId 유지
                        .role(existingUser.getRole())  // 기존 role 값
                        .phoneNumber(userExtraInfoDTO.getPhoneNumber())  // 업데이트할 phoneNumber 값
                        .familyRole(userExtraInfoDTO.getFamilyRole())  // 업데이트할 familyRole 값
                        .gender(userExtraInfoDTO.getGender())  // 업데이트할 gender 값
                        .age(userExtraInfoDTO.getAge())  // 업데이트할 age 값
                        .family(existingUser.getFamily())  // 기존 familyId 유지 (필요 시 null)
                        .build();

                // 엔티티 저장 (기존 행이 업데이트됨)
                userRepository.save(updatedUser);
                return "등록완료";  // 업데이트된 사용자 반환
            }
        }
        return null;  // 인증 실패 또는 사용자를 찾을 수 없을 때
    }

    public UserExtraInfoDTO getMypageDataInfo(Long userId) {
        //SecurityContextHolder를 통해 현재 인증된 사용자의 정보를 Authentication에 생성
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("authentication : " + authentication);

        //인증정보가 있고 인증된 사용자라면 if문 내용실행
        if (authentication != null && authentication.isAuthenticated()) {
            // 현재 인증된 사용자의 providerId를 가져옴
            CustomOAuth2User userDetails = (CustomOAuth2User) authentication.getPrincipal();

            String providerId = userDetails.getProviderId(); // CustomOAuth2User에서 providerId를 가져온다고 가정

            //해당 providerId DB에 접근해서 UserEntity정보를 가져옴
            UserEntity user = userRepository.findByProviderId(providerId);
            log.info("user.getFamilyRole : " + user.getFamilyRole());


            // 요청된 userId가 인증된 사용자와 다르면 예외를 던짐
            if (!userId.equals(user.getUserId())) {
                throw new CustomException("권한이 없습니다. 잘못된 사용자 요청입니다.");
            }

            //해당 유저의 Name과 FamilyRole 객체를 생성해서 리턴해줌

            return new UserExtraInfoDTO(
                    user.getFamilyRole(),
                    user.getPhoneNumber(),
                    user.getGender(),
                    user.getAge());
        }

        return null; // 인증되지 않은 경우
    }

}
