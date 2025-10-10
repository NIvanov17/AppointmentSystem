package com.example.appointmentsystem.model.DTOs;

import java.time.LocalDate;
import java.util.List;

public record AvailabilityResponse(
        long serviceId,
        long providerId,
        LocalDate date,
        String timezone,
        int durationMinutes,
        List<String> slots
) {}


