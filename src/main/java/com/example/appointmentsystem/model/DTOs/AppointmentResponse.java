package com.example.appointmentsystem.model.DTOs;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;

public record AppointmentResponse(
        Long id,
        Long serviceId,
        Long providerId,
        Long clientId,
        LocalDateTime startAt,
        int durationMinutes,
        String status
) {}
