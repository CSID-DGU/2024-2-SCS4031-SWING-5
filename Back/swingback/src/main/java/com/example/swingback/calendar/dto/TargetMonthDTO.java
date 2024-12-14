package com.example.swingback.calendar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TargetMonthDTO {
    private Long targetMonthId;
    private LocalDate targetMonth;
}
