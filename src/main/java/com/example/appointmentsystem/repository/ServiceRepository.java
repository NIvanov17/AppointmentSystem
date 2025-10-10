package com.example.appointmentsystem.repository;

import com.example.appointmentsystem.model.Service;
import com.example.appointmentsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Service, Long> {

    @Query("""
              SELECT s FROM Service s
              WHERE s.provider = :provider
            """)
    Service findByProvider(@Param("provider")User provider);
}

