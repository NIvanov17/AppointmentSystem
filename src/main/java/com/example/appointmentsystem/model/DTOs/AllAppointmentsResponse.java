package com.example.appointmentsystem.model.DTOs;

import com.example.appointmentsystem.model.enums.ServiceType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AllAppointmentsResponse(Long id,
                                      String name,
                                      String userNames,
                                      Integer durationInMinutes,
                                      Double price,
                                      ServiceType serviceType,
                                      LocalDateTime startDateTime,
                                      LocalDateTime endDateTime) {
}
