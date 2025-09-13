package com.example.appointmentsystem.controller;

import com.example.appointmentsystem.model.DTOs.RegisterServiceDTO;
import com.example.appointmentsystem.model.DTOs.ServiceDTO;
import com.example.appointmentsystem.model.enums.ServiceType;
import com.example.appointmentsystem.service.ServiceService;
import com.example.appointmentsystem.util.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceApi {

    private final ServiceService serviceService;

    private final JwtUtils jwt;

    @Autowired
    public ServiceApi(ServiceService serviceService, JwtUtils jwt) {
        this.serviceService = serviceService;
        this.jwt = jwt;
    }

    @GetMapping("/api/service-type")
    public List<String> getServiceTypes() {
        return Arrays.stream(ServiceType.values())
                .map(Enum::name)
                .toList();
    }

    @PostMapping("/api/register/service")
    public ResponseEntity<String> registerService(@Valid @RequestBody RegisterServiceDTO dto) {
        serviceService.registerservice(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Service registered successfully");
    }

    @GetMapping("/api/service/all")
    public ResponseEntity<List<ServiceDTO>> getAllAppointments(){
        List<ServiceDTO> services = serviceService.getAllServices();
        return ResponseEntity.status(HttpStatus.OK).body(services);
    }

}

