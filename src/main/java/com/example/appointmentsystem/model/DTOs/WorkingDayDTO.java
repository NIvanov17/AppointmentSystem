package com.example.appointmentsystem.model.DTOs;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record WorkingDayDTO(
        DayOfWeek dayOfWeek,
        @com.fasterxml.jackson.annotation.JsonFormat(pattern = "HH:mm") LocalTime startTime,
        @com.fasterxml.jackson.annotation.JsonFormat(pattern = "HH:mm") LocalTime endTime
) {}
