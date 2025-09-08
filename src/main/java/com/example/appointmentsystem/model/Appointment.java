package com.example.appointmentsystem.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne()
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne()
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Service service;

    @OneToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;


}
