package com.example.swingback.notification.message.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MessageTemplateDTO { // Service에서 return으로 넘겨줄 메시지 DTO
    private String title;
    private String body;
}
