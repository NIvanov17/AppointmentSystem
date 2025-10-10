package com.example.appointmentsystem.repository;

import com.example.appointmentsystem.model.User;
import com.example.appointmentsystem.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> getAllByRole(Role role);
}

