package com.example.swingback.calendar.common;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.calendar.entity.CalendarEntity;
import com.example.swingback.calendar.entity.TargetMonthEntity;
import com.example.swingback.calendar.repository.CalendarRepository;
import com.example.swingback.calendar.repository.TargetMonthRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;

@Component
@Getter
@RequiredArgsConstructor
public class BuilderCalendar {

    private final CalendarRepository calendarRepository;
    private final TargetMonthRepository targetMonthRepository;

    public void builderCalendarEntity(UserEntity useridMethod,
                                      String calendarTitleMethod,
                                      LocalDate startDateMethod,
                                      LocalDate endDateMethod,
                                      String calendarTargetCodeMethod) {

        LocalDate current = startDateMethod; // 현재 날짜 받기

        while (!current.isAfter(endDateMethod)) {
            String yearMonth = YearMonth.from(current).toString();

            // CalendarEntity를 먼저 생성하고 저장
            CalendarEntity calendarEntity = CalendarEntity.builder()
                    .userId(useridMethod)
                    .calendarTitle(calendarTitleMethod)
                    .startDate(startDateMethod)
                    .endDate(endDateMethod)
                    .calendarTargetCode(calendarTargetCodeMethod)
                    .displayDate(yearMonth)
                    .targetMonthList(new ArrayList<>())
                    .build();

            // CalendarEntity를 먼저 저장하여 영속화
            calendarRepository.save(calendarEntity);

            // 해당 월의 마지막 날 계산
            LocalDate endOfMonth = current.withDayOfMonth(current.lengthOfMonth());
            LocalDate periodEnd = endOfMonth.isBefore(endDateMethod) ? endOfMonth : endDateMethod;
            LocalDate displayDate = current;

            while (!displayDate.isAfter(periodEnd)) {
                TargetMonthEntity targetMonthEntity = TargetMonthEntity.builder()
                        .targetMonth(displayDate)
                        .calendarId(calendarEntity) // 이미 영속화된 CalendarEntity 사용
                        .build();

                // TargetMonthEntity를 저장
                targetMonthRepository.save(targetMonthEntity);

                // 리스트에 추가
                calendarEntity.getTargetMonthList().add(targetMonthEntity);
                displayDate = displayDate.plusDays(1);
            }

            current = periodEnd.plusDays(1); // 다음 달의 첫 날로 이동
        }
    }


}
