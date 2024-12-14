package com.example.swingback.calendar.entity;

import com.example.swingback.User.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "target_month")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class TargetMonthEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "target_month_id")
    private Long targetMonthId;

    @ManyToOne
    @JoinColumn(name = "calendar_id")
    private CalendarEntity calendarId;

    @Column(name = "target_month")
    private LocalDate targetMonth;
}
