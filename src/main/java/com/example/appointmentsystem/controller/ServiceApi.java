package com.example.appointmentsystem.controller;

import com.example.appointmentsystem.model.DTOs.RegisterServiceDTO;
import com.example.appointmentsystem.model.DTOs.ServiceDTO;
import com.example.appointmentsystem.model.enums.ServiceType;
import com.example.appointmentsystem.service.ServiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ServiceApi {

    private final ServiceService serviceService;

    @Autowired
    public ServiceApi(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping("/service-types")
    public List<String> getServiceTypes() {
        return Arrays.stream(ServiceType.values())
                .map(Enum::name)
                .toList();
    }

    @PostMapping("/register/service")
    public ResponseEntity<String> registerService(@Valid @RequestBody RegisterServiceDTO dto) {
        serviceService.registerservice(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Service registered successfully");
    }

    @GetMapping("/service/all")
    public ResponseEntity<List<ServiceDTO>> getAllAppointments(){
        List<ServiceDTO> services = serviceService.getAllServices();
        return ResponseEntity.status(HttpStatus.OK).body(services);
    }

}
