package com.example.swingback.healthcare.healthinfo.controller;

import com.example.swingback.error.CustomException;
import com.example.swingback.healthcare.healthinfo.dto.HealthcareDTO;
import com.example.swingback.healthcare.healthinfo.service.HealthcareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HealthcareController {

    private final HealthcareService bloodSugarService;
    @PostMapping("/api/healthcare")
    public HttpEntity<?> saveHealthcareInfo(@RequestBody List<HealthcareDTO> healthcareDTO) {
        String result = bloodSugarService.saveHealthcare(healthcareDTO);
        return(result != null) ?
                ResponseEntity.status(HttpStatus.OK).body(result) :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @ExceptionHandler(CustomException.class) // 코드가 없을경우 400 에러 발생
    public ResponseEntity<String> handleUnauthorizedException(CustomException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

}
