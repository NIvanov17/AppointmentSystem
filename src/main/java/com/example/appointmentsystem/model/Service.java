package com.example.appointmentsystem.model;

import com.example.appointmentsystem.model.enums.ServiceType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, name = "service_type")
    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

    @Column(nullable = false)
    private String name;

    @Lob
    @Column(nullable = false)
    private String description;

    @Positive
    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer durationMinutes;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private User provider;
}
