package com.example.swingback.oauth.service;


import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.oauth.dto.CustomOAuth2User;
import com.example.swingback.oauth.dto.KakaoResponse;
import com.example.swingback.oauth.dto.NaverResponse;
import com.example.swingback.oauth.dto.OAuth2Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        //Authorization & Resource Server로부터 받아온 데이터 oAuth2User에 저장
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("oAuth2User : "+oAuth2User.getAttributes());

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("kakao")) { // 가져온 유저정보가 kakao에서 제공한 내용이면 KakaoResponse 객체 생성

            oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("naver")) {// 가져온 유저정보가 Naver에서 제공한 내용이면 NaverResponse 객체 생성

            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else {

            return null;
        }


        String role = "ROLE_USER"; //role을 일괄적으로 설정해줌
        
        // 각 response 객체로부터 providerId 가져오기, kakao나 naver에서 제공하는 개인 식별 id값이 저장됨
        String providerId = oAuth2Response.getProviderId();
//        String provider = oAuth2Response.getProvider();

        // 해당 providerId로 유저가 DB에 저장되어있는지 확인
        UserEntity existData = userRepository.findByProviderId(providerId);
        
        
        
        if (existData == null) {// 해당 유저가 없다면 DB에 저장
            UserEntity userEntity = UserEntity.builder()
                    .providerId(providerId)
                    .email(oAuth2Response.getEmail())
                    .name(oAuth2Response.getNickname())
                    .role(role)
                    .provider(oAuth2Response.getProvider())
                    .build();
            userRepository.save(userEntity); // DB에 해당내용 저장
        } else { // 해당 유저가 있다면 변경된 이름과 이메일을 업데이트 해줌 
            existData.updateProfile(
                    oAuth2Response.getNickname()
                    ,oAuth2Response.getEmail()
                    ,role);
            userRepository.save(existData); // DB에 해당내용 저장
        }

        // 위에서 생성한 내용으로 CustomOAuth2User 객체 생성
        // 해당 값으로 유저 인증정보 확인함
        return new CustomOAuth2User(oAuth2Response, role); 
    }
}