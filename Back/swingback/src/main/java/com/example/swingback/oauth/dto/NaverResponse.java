package com.example.swingback.oauth.dto;

import java.util.Map;

public class NaverResponse implements OAuth2Response{

    private final Map<String, Object> attribute;

    public NaverResponse(Map<String, Object> attribute) {

        this.attribute = (Map<String, Object>) attribute.get("response");
    }

    @Override//제공자 (Ex. naver, google, ...)
    public String getProvider() {

        return "naver";
    }

    @Override//제공자에서 발급해주는 아이디(번호)
    public String getProviderId() {

        return attribute.get("id").toString();
    }

    @Override //Authorization & Resource Server로부터 가져온 eamil 주소
    public String getEmail() {

        return attribute.get("email").toString();
    }

    @Override //Authorization & Resource Server로부터 가져온 이름
    public String getNickname() {

        return attribute.get("name").toString();
    }
}
