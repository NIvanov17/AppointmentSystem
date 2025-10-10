package com.example.appointmentsystem.model.DTOs;

import java.time.LocalDateTime;


public record CreateAppointmentRequest(
        Long serviceId,
        Long providerId,
        LocalDateTime startAt
) {}
