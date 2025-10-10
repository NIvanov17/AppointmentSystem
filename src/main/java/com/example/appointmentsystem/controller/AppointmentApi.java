package com.example.appointmentsystem.controller;

import com.example.appointmentsystem.model.DTOs.AllAppointmentsResponse;
import com.example.appointmentsystem.model.DTOs.AppointmentResponse;
import com.example.appointmentsystem.model.DTOs.AvailabilityResponse;
import com.example.appointmentsystem.model.DTOs.CreateAppointmentRequest;
import com.example.appointmentsystem.service.AppointmentService;
import com.example.appointmentsystem.util.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentApi {

    private final AppointmentService appointmentService;

    private final JwtUtils jwt;

    @Autowired
    public AppointmentApi(AppointmentService appointmentService, JwtUtils jwt) {
        this.appointmentService = appointmentService;
        this.jwt = jwt;
    }

    @GetMapping("/api/appointments/available-slots")
    public ResponseEntity<AvailabilityResponse> getAvailableSlotsForDay(@RequestParam long serviceId, @RequestParam("date") String dateAsString) {
        LocalDate date = LocalDate.parse(dateAsString);
        AvailabilityResponse res = appointmentService.getAvailableSlotsForDay(serviceId, date);
        return ResponseEntity.status(HttpStatus.OK).cacheControl(CacheControl.noStore()).body(res);
    }

    @PostMapping("/api/appointment")
    public ResponseEntity<AppointmentResponse> create(
            @RequestBody CreateAppointmentRequest req,
            HttpServletRequest request
    ) throws ChangeSetPersister.NotFoundException {
        String token = jwt.getTokenFromRequest(request);
        String email = jwt.extractEmail(token);

        AppointmentResponse created = appointmentService.createAppointment(
                email,
                req.serviceId(),
                req.providerId(),
                req.startAt()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/api/appointments/all")
    public ResponseEntity<List<AllAppointmentsResponse>> getAllAppointments(HttpServletRequest request) {
        String token = jwt.getTokenFromRequest(request);
        String email = jwt.extractEmail(token);
        List<AllAppointmentsResponse> list = appointmentService.geAllAppointmentsForUser(email);
        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    @GetMapping("/api/provider/appointments/all")
    public ResponseEntity<List<AllAppointmentsResponse>> getAllAppointmentsForProvider(HttpServletRequest request) {
        String token = jwt.getTokenFromRequest(request);
        String email = jwt.extractEmail(token);
        List<AllAppointmentsResponse> list = appointmentService.geAllAppointmentByProvider(email);
        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    @DeleteMapping("/api/appointment/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String token = jwt.getTokenFromRequest(request);
        String email = jwt.extractEmail(token);
        appointmentService.deleteAppointment(id, email);
        return ResponseEntity.noContent().build();
    }

}
