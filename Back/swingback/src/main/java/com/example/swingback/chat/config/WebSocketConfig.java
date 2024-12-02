package com.example.swingback.chat.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/stomp/chat") //
                .setAllowedOrigins("http://localhost:3000") //
                .withSockJS(); // SockJS 추가;
    }


    // 기존 그룹채팅용 설정
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // pub은 메시지 송신, sub은 메시지 구독에 사용
        registry.setApplicationDestinationPrefixes("/pub"); // 송신 메시지
        registry.enableSimpleBroker("/sub"); // 구독 경로
    }


}
