package com.example.swingback.calendar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarDTO {
    private Long calendarId;
    private String calendarTitle;
    private LocalDate startDate;
    private LocalDate endDate;
    private String calendarTargetCode;
    private String displayDate;
    private List<TargetMonthDTO> target;
}
