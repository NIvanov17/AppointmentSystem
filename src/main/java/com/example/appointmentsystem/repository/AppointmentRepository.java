package com.example.appointmentsystem.repository;

import com.example.appointmentsystem.model.Appointment;
import com.example.appointmentsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query("""
              SELECT a FROM Appointment a
              WHERE a.provider.id = :providerId
                AND a.schedule.startTime < :dayEnd
                AND a.schedule.endTime   > :dayStart
            """)
    List<Appointment> findOverlappingOnDay(@Param("providerId") long providerId,
                                           @Param("dayStart") LocalDateTime dayStart,
                                           @Param("dayEnd") LocalDateTime dayEnd);

    @Query("""
            SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END
            FROM Appointment a
            JOIN a.schedule s
            WHERE a.provider.id = :providerId
              AND a.service.id = :serviceId
              AND s.startTime < :endAt
              AND s.endTime > :startAt
            """)
    boolean existsOverlapping(@Param("providerId") Long providerId,
                              @Param("serviceId") Long serviceId,
                              @Param("startAt") LocalDateTime startAt,
                              @Param("endAt") LocalDateTime endAt);

    List<Appointment> getAllByClient(User user);

    List<Appointment> getAllByProvider(User user);
}

