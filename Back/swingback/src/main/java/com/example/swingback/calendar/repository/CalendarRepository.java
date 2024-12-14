package com.example.swingback.calendar.repository;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.calendar.entity.CalendarEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarRepository extends JpaRepository<CalendarEntity,Long> {

    Optional<List<CalendarEntity>> findByUserIdAndDisplayDate(UserEntity userId, String date);
}
