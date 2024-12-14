package com.example.swingback.calendar.entity;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.calendar.repository.TargetMonthRepository;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "calendar")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class CalendarEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "calendar_id")
    private Long calendarId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userId;

    @Column(name = "calendar_title")
    private String calendarTitle;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_data")
    private LocalDate endDate;

    @Column(name = "calendar_target_code")
    private String calendarTargetCode;

    @Column(name = "display_date")
    private String displayDate;

    @OneToMany(mappedBy = "calendarId") // TargetMonthEntity에서 연결된 필드명 입력(calendarId)
    private List<TargetMonthEntity> targetMonthList;



}
