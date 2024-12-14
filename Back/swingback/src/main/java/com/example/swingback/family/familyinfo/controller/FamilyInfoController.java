package com.example.swingback.family.familyinfo.controller;

import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.error.CustomException;
import com.example.swingback.family.familyinfo.dto.FamilyInfoDTO;
import com.example.swingback.family.familyinfo.service.FamilyInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class FamilyInfoController {

    private final FamilyInfoService familyInfoService;

    @GetMapping("/api/family/{userId}")
    public ResponseEntity<?> getFamilyInfo(@PathVariable Long userId) {
        List<FamilyInfoDTO> familyInfo = familyInfoService.findFamilyInfo(userId);
        return (familyInfo!=null)?
                ResponseEntity.status(HttpStatus.OK).body(familyInfo):
                ResponseEntity.status(HttpStatus.OK).body("가족이 존재하지 않습니다");
    }
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<String> handleUnauthorizedException(CustomException e) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }

}
