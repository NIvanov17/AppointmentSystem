package com.example.appointmentsystem.repository;

import com.example.appointmentsystem.model.Schedule;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select s from Schedule s
        where s.provider.id = :providerId
          and s.service.id  = :serviceId
          and s.startTime  = :startTime
    """)
    Optional<Schedule> lockSlot(@Param("providerId") Long providerId,
                                      @Param("serviceId")  Long serviceId,
                                      @Param("startTime") LocalDateTime startTime);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Schedule s where s.id = :id")
    Optional<Schedule> lockById(@Param("id") Long id);
}
