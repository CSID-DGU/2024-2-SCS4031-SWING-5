package com.example.swingback.notification.message.service;

import com.example.swingback.notification.message.dto.MessageTemplateDTO;
import com.example.swingback.notification.message.entity.MessageTemplateEntity;
import com.example.swingback.notification.message.repository.MessageTemplateRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

@Service
public class MessageTemplateService {

    @Autowired
    private MessageTemplateRepository repository;

    public MessageTemplateDTO generateMessage(Long templateId, Map<String, String> variables) {
        //템플릿을 DB에서 찾아옴
        MessageTemplateEntity template = repository.findById(templateId)
                .orElseThrow(() -> new IllegalArgumentException("Template not found"));

        //찾아온 템플릿의 title과 body를 저장함
        String title = template.getTitle();
        String body = template.getBody();

        // 변수를 대입하여 제목과 본문을 동적으로 생성
        for (Map.Entry<String, String> entry : variables.entrySet()) { // 순회를 위한 entry생성
            String placeholder = "{" + entry.getKey() + "}"; // 교체할 부분 생성
            title = title.replace(placeholder, entry.getValue()); // replace를 이용해서 title내용을 교체
            body = body.replace(placeholder, entry.getValue()); // replace를 이용해서 body내용을 교체
        }

        return new MessageTemplateDTO(title, body);
    }
}

