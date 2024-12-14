package com.example.swingback.ocr.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;


import java.util.HashMap;
import java.util.Map;

@Service
public class OCRService {

    @Value("${chatgpt.api.key}")
    private String chatGptApiKey;

    public String processOCRData(String ocrData) throws Exception {
        // ChatGPT API 호출
        String chatGptResponse = callChatGptApi(ocrData);

        // 응답에서 content 필드만 추출
        return extractContentFromResponse(chatGptResponse);
    }

    private String callChatGptApi(String ocrData) {
        RestTemplate restTemplate = new RestTemplate();

        // ChatGPT API URL
        String url = "https://api.openai.com/v1/chat/completions";

        // ChatGPT 요청 데이터
        Map<String, Object> chatRequest = new HashMap<>();
        chatRequest.put("model", "gpt-3.5-turbo");
//        chatRequest.put("model", "gpt-4");
        chatRequest.put("messages", new Object[]{
                Map.of("role", "system", "content",
                        "You are an assistant that extracts dispensing date and detailed medicine information from OCR data."),
                Map.of("role", "user", "content",
                        "Extract the dispensing date (조제일자), medicine name (약이름/약품명), dosage (투약량/수량), frequency (횟수/투여횟수), and duration (투약일수/일수) " +
                                "from the following OCR text. Return the result as a JSON object in the following format: \n\n" +
                                "{\n" +
                                "  \"registrationDate\": \"조제일자\",\n" +
                                "  \"medicineList\": [\n" +
                                "    {\n" +
                                "      \"medicineName\": \"약이름\",\n" +
                                "      \"dosagePerIntake\": \"투약량\",\n" +
                                "      \"frequencyIntake\": \"횟수\",\n" +
                                "      \"durationIntake\": \"일수\"\n" +
                                "    }\n" +
                                "  ]\n" +
                                "}\n\n" +
                                "Here is the OCR text:\n" +
                                ocrData)
        });

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "Bearer " + chatGptApiKey);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(chatRequest, headers);

        // ChatGPT API 호출
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("Failed to call ChatGPT API: " + response.getStatusCode());
        }
    }

    private String extractContentFromResponse(String chatGptResponse) throws Exception {
        // Jackson ObjectMapper를 사용해 JSON 파싱
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(chatGptResponse);

        // content 필드 추출
        JsonNode contentNode = rootNode.path("choices").get(0).path("message").path("content");

        // content 내부 JSON만 반환 (양쪽에 ```json 제거)
        String content = contentNode.asText().trim();
        if (content.startsWith("```json")) {
            content = content.substring(7).trim(); // ```json 제거
        }
        if (content.endsWith("```")) {
            content = content.substring(0, content.length() - 3).trim(); // ``` 제거
        }

        return content;
    }
}