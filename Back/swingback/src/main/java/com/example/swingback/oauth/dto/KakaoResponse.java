package com.example.swingback.oauth.dto;

import java.util.Map;

public class KakaoResponse implements OAuth2Response{

    private final Map<String, Object> attribute;

    public KakaoResponse(Map<String, Object> attribute) {

//        this.attribute = (Map<String, Object>) attribute.get("kakao_account");
        this.attribute = attribute;
    }

    @Override//제공자 (Ex. naver, google, ...)
    public String getProvider() {

        return "kakao";
    }

    @Override//제공자에서 발급해주는 아이디(번호)
    public String getProviderId() {

        return attribute.get("id").toString();
    }

    @Override
    public String getEmail() {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attribute.get("kakao_account");
        return kakaoAccount.get("email").toString();
    }

    @Override
    public String getNickname() {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attribute.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        return profile.get("nickname").toString();
    }
}
