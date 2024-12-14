package com.example.swingback.calendar.controller;

import com.example.swingback.calendar.dto.CalendarDTO;
import com.example.swingback.calendar.service.CalendarService;
import com.example.swingback.error.CustomException;
import com.example.swingback.healthcare.healthinfo.dto.MeasurementByTypeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping("/api/calendar/{userId}")
    public ResponseEntity<?> getCalendarInfo(@PathVariable Long userId,
                                             @RequestParam String date) {
        List<CalendarDTO> calendarInfo = calendarService.findCalendarInfo(userId, date);
        return (!calendarInfo.isEmpty()) ?
                ResponseEntity.status(HttpStatus.OK).body(calendarInfo) :
                ResponseEntity.status(HttpStatus.OK).body("일정이 없습니다");

    }
    @GetMapping("/api/calendar/day/{userId}")
    public ResponseEntity<?> getMeasurementsGroupedByType(@PathVariable Long userId,
                                                          @RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date); // String을 LocalDate로 변환
        List<MeasurementByTypeDTO> measurements = calendarService.getMeasurementsGroupedByType(userId, localDate);
        return (!measurements.isEmpty()) ?
                ResponseEntity.status(HttpStatus.OK).body(measurements) :
                ResponseEntity.status(HttpStatus.OK).body("해당 날짜에 데이터가 없습니다.");
    }

    @ExceptionHandler(CustomException.class) // 코드가 없을경우 400 에러 발생
    public ResponseEntity<String> handleUnauthorizedException(CustomException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

}
