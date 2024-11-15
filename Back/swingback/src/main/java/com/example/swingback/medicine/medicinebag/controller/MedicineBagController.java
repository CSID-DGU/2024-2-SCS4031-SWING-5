package com.example.swingback.medicine.medicinebag.controller;

import com.example.swingback.error.CustomException;
import com.example.swingback.medicine.medicationmanagement.dto.MedicationManagementDTO;
import com.example.swingback.medicine.medicinebag.dto.MedicineBagDTO;
import com.example.swingback.medicine.medicineinput.dto.MedicineInputDTO;
import com.example.swingback.medicine.medicinebag.service.MedicineBagSservice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class MedicineBagController {
    private final MedicineBagSservice medicineBagSservice;

    @PostMapping("/api/medicine")
    public ResponseEntity<?> saveUserMedicineBag(@RequestBody MedicineBagDTO medicineBagDTO) {
        // 받은 DTO 데이터를 처리하는 로직
        log.info("회원 ID: {}", medicineBagDTO.getUserId());
        log.info("약 제목: {}", medicineBagDTO.getMedicineBagTitle());

        for (MedicineInputDTO medicine : medicineBagDTO.getMedicineList()) {
            log.info("약 이름: {}", medicine.getMedicineName());
            log.info("복용량 {}", medicine.getDosagePerIntake());
            log.info("복용 확인: {}", medicine.getIntakeConfirmed());
        }

        medicineBagSservice.saveMedicineInputAndBag(medicineBagDTO);
        return ResponseEntity.status(HttpStatus.OK).body("등록 성공");
    }

    @GetMapping("/api/medicine/{userId}")
    public ResponseEntity<List<MedicationManagementDTO>> sendMedicineBag(@PathVariable Long userId,@RequestParam LocalDate date) {
        List<MedicationManagementDTO> medicineBagInfo = medicineBagSservice.findMedicineBagInfo(userId, date);
        return (!medicineBagInfo.isEmpty()) ?
                ResponseEntity.status(HttpStatus.OK).body(medicineBagInfo) :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @

    @ExceptionHandler(CustomException.class) // 코드가 없을경우 400 에러 발생
    public ResponseEntity<String> handleUnauthorizedException(CustomException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
