package com.example.swingback.config;

import com.example.swingback.oauth.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService) {
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers(
                                "/",
                                "/login/**",
                                "/oauth2/**",
                                "/api/main",
                                "/api/userextra",
                                "/api/extrainfo",
                                "/api/family/code",
                                "/api/save-token",
                                "/api/send-notification",
                                "/api/code/request",
                                "/api/code/request/result",
                                "/api/notification/**",
                                "/api/medicine",
                                "/api/**")
                        .permitAll()
                        .anyRequest().authenticated());

        http
                .csrf((csrf) -> csrf.disable());

        http
                .formLogin((login) -> login.disable());

        http
                .httpBasic((basic) -> basic.disable());

        http
                .oauth2Login((oauth2) -> oauth2
                        .loginPage("http://localhost:8081/login") // 로그인 페이지 URL
                        .defaultSuccessUrl("http://localhost:8081/successpage") // 로그인 후 리디렉션
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService)));

        // 세션 관리 설정 추가
        http
                .sessionManagement((sessionManagement) -> sessionManagement
                        .maximumSessions(1) // 한 세션만 허용
                        .expiredUrl("http://localhost:8081/login?expired=true")); // 세션 만료 시 리디렉션

        return http.build();
    }
}
