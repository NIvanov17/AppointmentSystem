package com.example.appointmentsystem.service;

import com.example.appointmentsystem.model.Appointment;
import com.example.appointmentsystem.model.DTOs.AllAppointmentsResponse;
import com.example.appointmentsystem.model.DTOs.AppointmentResponse;
import com.example.appointmentsystem.model.DTOs.AvailabilityResponse;
import com.example.appointmentsystem.model.Schedule;
import com.example.appointmentsystem.model.User;
import com.example.appointmentsystem.model.WorkingDay;
import com.example.appointmentsystem.repository.AppointmentRepository;
import com.example.appointmentsystem.repository.ScheduleRepository;
import com.example.appointmentsystem.repository.ServiceRepository;
import com.example.appointmentsystem.repository.WorkingDayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    private final ServiceRepository serviceRepository;

    private final WorkingDayRepository workingDayRepository;

    private final ScheduleRepository scheduleRepository;

    private final UserService userService;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, ServiceRepository serviceRepository, WorkingDayRepository workingDayRepository, ScheduleRepository scheduleRepository, UserService userService) {
        this.appointmentRepository = appointmentRepository;
        this.serviceRepository = serviceRepository;
        this.workingDayRepository = workingDayRepository;
        this.scheduleRepository = scheduleRepository;
        this.userService = userService;
    }

    public AvailabilityResponse getAvailableSlotsForDay(long serviceId, LocalDate date) {
        com.example.appointmentsystem.model.Service service = serviceRepository.getById(serviceId);
        User provider = service.getProvider();
        ZoneId businessZone = ZoneId.of("Europe/Sofia");
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        Optional<WorkingDay> workingDayOptional =
                workingDayRepository.findByProviderIdAndDayOfWeek(provider.getId(), dayOfWeek);

        if (workingDayOptional.isEmpty()) {
            // Provider is off this day
            return new AvailabilityResponse(serviceId, provider.getId(), date,
                    businessZone.getId(), service.getDurationMinutes(), List.of());
        }

        WorkingDay workingDay = workingDayOptional.get();
        LocalTime workStart = workingDay.getStartTime();
        LocalTime workEnd = workingDay.getEndTime();
        int durationMinutes = service.getDurationMinutes();

        // Build candidate slots
        List<LocalDateTime> candidateStarts = new ArrayList<>();
        LocalTime cursor = workStart;
        while (!cursor.plusMinutes(durationMinutes).isAfter(workEnd)) {
            candidateStarts.add(LocalDateTime.of(date, cursor));
            cursor = cursor.plusMinutes(durationMinutes); // simple back-to-back stepping
        }

        // Fetch existing appointments for this provider on this date
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
        List<Appointment> existingAppointments =
                appointmentRepository.findOverlappingOnDay(provider.getId(), dayStart, dayEnd);

        // Build list of unavailable ranges
        List<TimeRange> blockedRanges = existingAppointments.stream()
                .map(a -> new TimeRange(a.getSchedule().getStartTime(), a.getSchedule().getEndTime()))
                .toList();

        // Filter free slots
        List<String> freeSlots = candidateStarts.stream()
                .filter(start -> blockedRanges.stream().noneMatch(blocked ->
                        overlaps(start, start.plusMinutes(durationMinutes),
                                blocked.start(), blocked.end())))
                .map(start -> start.toLocalTime().toString()) //"HH:mm"
                .toList();

        return new AvailabilityResponse(
                serviceId,
                provider.getId(),
                date,
                businessZone.getId(),
                durationMinutes,
                freeSlots
        );
    }

    private boolean overlaps(LocalDateTime start1, LocalDateTime end1,
                             LocalDateTime start2, LocalDateTime end2) {
        return start1.isBefore(end2) && end1.isAfter(start2);
    }

    public List<AllAppointmentsResponse> geAllAppointmentsForUser(String email) {
        User user = userService.getUserByEmail(email);
        List<Appointment> allByClient = appointmentRepository.getAllByClient(user);
        List<AllAppointmentsResponse> allAppointments = new ArrayList<>();
        allByClient.forEach(a -> {
            AllAppointmentsResponse res = new AllAppointmentsResponse(a.getId(),
                    a.getService().getName(),
                    a.getProvider().getFirstName() + " " + a.getProvider().getLastName(),
                    a.getService().getDurationMinutes(),
                    a.getService().getPrice(),
                    a.getService().getServiceType(),
                    a.getSchedule().getStartTime(),
                    a.getSchedule().getEndTime());
            allAppointments.add(res);
        });
        return allAppointments;
    }

    public List<AllAppointmentsResponse> geAllAppointmentByProvider(String email) {
        User user = userService.getUserByEmail(email);
        List<Appointment> allByClient = appointmentRepository.getAllByProvider(user);
        List<AllAppointmentsResponse> allAppointments = new ArrayList<>();
        allByClient.forEach(a -> {
            AllAppointmentsResponse res = new AllAppointmentsResponse(a.getId(),
                    a.getService().getName(),
                    a.getClient().getFirstName()+ " " + a.getClient().getLastName(),
                    a.getService().getDurationMinutes(),
                    a.getService().getPrice(),
                    a.getService().getServiceType(),
                    a.getSchedule().getStartTime(),
                    a.getSchedule().getEndTime());
            allAppointments.add(res);
        });
        return allAppointments;
    }

    private static record TimeRange(LocalDateTime start, LocalDateTime end) {
    }

    public AppointmentResponse createAppointment(
            String email,
            Long serviceId,
            Long providerId,
            LocalDateTime startAt
    ) throws ChangeSetPersister.NotFoundException {

        com.example.appointmentsystem.model.Service serviceEntity =
                serviceRepository.findById(serviceId)
                        .orElseThrow(ChangeSetPersister.NotFoundException::new);

        User client = userService.getUserByEmail(email);
        User provider = userService.getUserById(providerId);

        int durationMinutes = serviceEntity.getDurationMinutes();
        LocalDateTime endAt = startAt.plusMinutes(durationMinutes);

        validateWorkingWindow(providerId, startAt, endAt);

        Optional<Schedule> lockedOpt = scheduleRepository.lockSlot(providerId, serviceId, startAt);

        Schedule slot;
        if (lockedOpt.isPresent()) {
            slot = lockedOpt.get();
        } else {
            Schedule newSlot = new Schedule();
            newSlot.setProvider(provider);
            newSlot.setService(serviceEntity);
            newSlot.setStartTime(startAt);
            newSlot.setEndTime(endAt);
            newSlot.setAvailable(Boolean.TRUE);
            scheduleRepository.saveAndFlush(newSlot);

            // Lock again to avoid races
            slot = scheduleRepository.lockSlot(providerId, serviceId, startAt)
                    .orElseThrow(() -> new IllegalStateException("Slot creation race, please retry."));
        }

        if (Boolean.FALSE.equals(slot.getAvailable())) {
            throw new IllegalStateException("Time slot already booked.");
        }

        boolean hasOverlap = appointmentRepository.existsOverlapping(
                providerId, serviceId, startAt, endAt
        );
        if (hasOverlap) {
            throw new IllegalStateException("Overlapping appointment exists.");
        }

        slot.setAvailable(Boolean.FALSE);
        scheduleRepository.save(slot);

        Appointment appointment = new Appointment();
        appointment.setClient(client);
        appointment.setProvider(provider);
        appointment.setService(serviceEntity);
        appointment.setSchedule(slot);
        Appointment saved = appointmentRepository.save(appointment);

        return new AppointmentResponse(
                saved.getId(),
                serviceId,
                providerId,
                client.getId(),
                slot.getStartTime(),
                durationMinutes,
                "CONFIRMED"
        );
    }

    private void validateWorkingWindow(Long providerId,
                                       LocalDateTime startAt,
                                       LocalDateTime endAt) {
        if (providerId == null || startAt == null || endAt == null) {
            throw new IllegalArgumentException("providerId, startAt, and endAt are required.");
        }
        if (!endAt.isAfter(startAt)) {
            throw new IllegalArgumentException("endAt must be after startAt.");
        }

        DayOfWeek dow = startAt.getDayOfWeek();

        WorkingDay workingDay = workingDayRepository
                .findByProviderIdAndDayOfWeek(providerId, dow)
                .orElseThrow(() -> new IllegalStateException("Provider does not work on this day."));

        LocalTime startAllowed = workingDay.getStartTime();
        LocalTime endAllowed = workingDay.getEndTime();

        LocalTime startLocal = startAt.toLocalTime();
        LocalTime endLocal = endAt.toLocalTime();

        boolean crossesDay = !endAt.toLocalDate().equals(startAt.toLocalDate());

        boolean startsBefore = startLocal.isBefore(startAllowed);
        boolean endsAfter = endLocal.isAfter(endAllowed);

        if (crossesDay || startsBefore || endsAfter) {
            throw new IllegalStateException("Outside working hours.");
        }
    }

    public void deleteAppointment(Long appointmentId, String actorEmail) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new NoSuchElementException("Appointment not found."));

        if (!appt.getClient().getEmail().equals(actorEmail)) {
            throw new SecurityException("You are not allowed to delete this appointment.");
        }

        Schedule slot = appt.getSchedule();
        if (slot != null) {
            slot.setAvailable(true);
            scheduleRepository.save(slot);
        }

        appointmentRepository.delete(appt);
    }
}
