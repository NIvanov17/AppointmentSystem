package com.example.appointmentsystem.repository;

import com.example.appointmentsystem.model.WorkingDay;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkingDayRepository extends JpaRepository<WorkingDay, Long> {
}
