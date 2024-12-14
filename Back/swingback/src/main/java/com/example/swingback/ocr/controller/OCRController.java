package com.example.swingback.ocr.controller;

import com.example.swingback.ocr.service.OCRService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OCRController {


    private final OCRService ocrService;

    @PostMapping("/api/ocr/process")
    public ResponseEntity<?> processOCRData(@RequestBody Map<String, String> requestBody) {
        String ocrData = requestBody.get("body"); // OCR 데이터가 "body" 필드에 포함되어 있음

        if (ocrData == null || ocrData.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("OCR data is missing.");
        }

        try {
            // 서비스 호출
            String content = ocrService.processOCRData(ocrData);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing OCR data: " + e.getMessage());
        }
    }
}
