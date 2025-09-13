package com.example.appointmentsystem.model.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record RegisterServiceDTO(@NotBlank String serviceType,
                                 @NotBlank String name,
                                 @NotBlank String description,
                                 @NotNull @Positive Double price,
                                 @NotNull @Positive Integer durationMinutes,
                                 @NotBlank String providerEmail,
                                 @NotNull List<WorkingDayDTO> workingDays) {
}
