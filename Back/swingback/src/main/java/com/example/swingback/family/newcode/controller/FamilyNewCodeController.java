package com.example.swingback.family.newcode.controller;

import com.example.swingback.error.CustomException;
import com.example.swingback.family.newcode.DTO.NewCodeDTO;
import com.example.swingback.family.newcode.service.FamilyNewCodeServivce;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class FamilyNewCodeController {

    private final FamilyNewCodeServivce familyNewCodeServivce;

    @GetMapping("/api/family/code")
    public ResponseEntity<String> getNewCode() {

        NewCodeDTO code = familyNewCodeServivce.findByCodMyFamily();
        return (code.getFamilyId()!=null)?
                ResponseEntity.status(HttpStatus.OK).body(code.getFamilyId()):
                ResponseEntity.status(HttpStatus.OK).body(code.getNewCode());
    }

    @GetMapping("/api/family/code/{userId}")
    public ResponseEntity<String> findFamilyCodeInMypage(@PathVariable Long userId) {
        String familyCodeByUserId = familyNewCodeServivce.findFamilyCodeByUserId(userId);
        return familyCodeByUserId.equals("N")?
                ResponseEntity.status(HttpStatus.OK).body("N"):
                ResponseEntity.status(HttpStatus.OK).body(familyCodeByUserId);
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<String> handleUnauthorizedException(CustomException e) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }

}
