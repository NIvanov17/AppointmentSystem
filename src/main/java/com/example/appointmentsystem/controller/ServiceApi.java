package com.example.appointmentsystem.controller;

import com.example.appointmentsystem.model.DTOs.*;
import com.example.appointmentsystem.model.enums.ServiceType;
import com.example.appointmentsystem.service.ServiceService;
import com.example.appointmentsystem.util.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
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
        return ResponseEntity.status(HttpStatus.CREATED).body("Service registered successfully!");
    }

    @GetMapping("/api/service/all")
    public ResponseEntity<List<ServiceDTO>> getAllAppointments() {
        List<ServiceDTO> services = serviceService.getAllServices();
        return ResponseEntity.status(HttpStatus.OK).body(services);
    }

    @GetMapping("/api/provider/services")
    public ResponseEntity<UpdateServiceDTO> getAllServices(HttpServletRequest request) {
        String token = jwt.getTokenFromRequest(request);
        String email = jwt.extractEmail(token);
        UpdateServiceDTO dto = serviceService.getServiceDataByProviderEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    @PutMapping("/api/provider/service/{id}")
    public ResponseEntity<String> updateService(@PathVariable Long id,
                                                @RequestBody UpdateServiceDTO dto,
                                                HttpServletRequest request){
        serviceService.updateService(id, dto);
        return ResponseEntity.ok("Service updated");
    }


}
