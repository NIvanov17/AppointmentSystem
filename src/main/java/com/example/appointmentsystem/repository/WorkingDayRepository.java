package com.example.appointmentsystem.repository;

import com.example.appointmentsystem.model.User;
import com.example.appointmentsystem.model.WorkingDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkingDayRepository extends JpaRepository<WorkingDay, Long> {
    Optional<WorkingDay> findByProviderIdAndDayOfWeek(long id, DayOfWeek dayOfWeek);

    List<WorkingDay> findByProviderId(long id);
}

