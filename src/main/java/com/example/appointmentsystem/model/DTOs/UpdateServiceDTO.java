package com.example.appointmentsystem.model.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record UpdateServiceDTO(long id,
                               String serviceType,
                               String name,
                               String description,
                               Double price,
                               Integer durationMinutes,
                               String providerEmail,
                               List<WorkingDayDTO> workingDays) {
}
