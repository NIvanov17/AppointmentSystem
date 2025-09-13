package com.example.appointmentsystem.model.DTOs;

import java.util.List;

public record ServiceRegisterDTO(
        String serviceType,
        String name,
        String description,
        double price,
        int durationMinutes,
        String providerEmail,
        List<WorkingDayDTO> workingDays
) {}
