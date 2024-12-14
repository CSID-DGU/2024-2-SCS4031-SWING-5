package com.example.swingback.notification.token.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.error.CustomException;
import com.example.swingback.notification.token.dto.FCMTokenDTO;
import com.example.swingback.notification.token.entity.FCMTokenEntity;
import com.example.swingback.notification.token.repository.FCMTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FCMTokenService {

    private final FCMTokenRepository tokenRepository;
    private final UserRepository userRepository;

    @Transactional
    public void tokenSave(FCMTokenDTO fcmTokenDTO) {
        //SecurityContextHolder를 통해 현재 인증된 사용자의 정보를 Authentication에 생성
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //인증된 사용자가 아니면 에러띄워주기
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException("인증되지 않은 회원입니다");
        }
        // 프론트에서 넘어온 UserId로 DB에 유저가 있는지 확인
        UserEntity userEntity = userRepository.findByUserId(fcmTokenDTO.getUserId());

        // 해당 유저의 정보와 토큰으로 토큰 테이블에 정보가 저장되어있나 확인 , 토큰,id 둘이 동시에 가지고 있어야함
        Optional<FCMTokenEntity> existingToken =
                tokenRepository.findByTokenAndUserId(
                        fcmTokenDTO.getToken(),userEntity);
        // 새로운 TokenEntity 생성 및 저장
        // optional로 정보 가져왔으므로 있으면 .isPresent() 없으면 .isEmpty()로 확인
        if (existingToken.isEmpty()) {
            log.info("토큰이 존재하지 않습니다, 토큰을 저장합니다.");
            FCMTokenEntity tokenEntity = FCMTokenEntity.builder()
                    .userId(userEntity)
                    .token(fcmTokenDTO.getToken())
                    .recentUseDate(new Date())
                    .build();

            tokenRepository.save(tokenEntity);
        }else log.info("토큰이 존재합니다.");



    }
}
