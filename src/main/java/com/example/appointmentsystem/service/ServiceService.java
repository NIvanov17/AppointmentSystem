package com.example.appointmentsystem.service;

import com.example.appointmentsystem.model.DTOs.*;
import com.example.appointmentsystem.model.User;
import com.example.appointmentsystem.model.WorkingDay;
import com.example.appointmentsystem.model.enums.ServiceType;
import com.example.appointmentsystem.repository.ServiceRepository;
import com.example.appointmentsystem.repository.WorkingDayRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Locale;


@Service
@Transactional
public class ServiceService {

    private final ServiceRepository serviceRepository;

    private final UserService userService;

    private final WorkingDayRepository workingDayRepository;


    @Autowired
    public ServiceService(ServiceRepository serviceRepository, UserService userService, WorkingDayRepository workingDayRepository) {
        this.serviceRepository = serviceRepository;
        this.userService = userService;
        this.workingDayRepository = workingDayRepository;
    }


    public void registerservice(RegisterServiceDTO dto) {
        String userEmail = dto.providerEmail();
        User user = userService.getUserByEmail(userEmail);
        com.example.appointmentsystem.model.Service service = new com.example.appointmentsystem.model.Service();
        service.setServiceType(ServiceType.valueOf(dto.serviceType()));
        service.setDescription(dto.description());
        service.setName(dto.name());
        service.setDurationMinutes(dto.durationMinutes());
        service.setPrice(dto.price());
        service.setProvider(user);
        if (user.getServices() != null) {
            user.getServices().add(service);
        }
        List<WorkingDay> toSave = dto.workingDays().stream().map(wd -> {
            if (!wd.startTime().isBefore(wd.endTime())) {
                throw new IllegalArgumentException("Start must be before end for " + wd.dayOfWeek());
            }
            WorkingDay workingDay = new WorkingDay();
            workingDay.setProvider(user);
            workingDay.setStartTime(wd.startTime());
            workingDay.setEndTime(wd.endTime());
            workingDay.setDayOfWeek(wd.dayOfWeek());
            return workingDay;
        }).toList();
        workingDayRepository.saveAll(toSave);
        serviceRepository.save(service);
    }

    public List<ServiceDTO> getAllServices() {
        List<com.example.appointmentsystem.model.Service> all = serviceRepository.findAll();
        List<ServiceDTO> dtos = new ArrayList<>();
        for (com.example.appointmentsystem.model.Service service : all) {
            User provider = service.getProvider();
            ProvidersNamesDTOs providerDTO = new ProvidersNamesDTOs(provider.getId(), provider.getFirstName(), provider.getLastName());
            ServiceDTO serviceDTO = new ServiceDTO();
            serviceDTO.setId(service.getId());
            serviceDTO.setServiceId(service.getId());
            serviceDTO.setName(service.getName());
            serviceDTO.setDescription(service.getDescription());
            serviceDTO.setProvider(providerDTO);
            serviceDTO.setPrice(service.getPrice());
            serviceDTO.setDuration(service.getDurationMinutes());
            serviceDTO.setServiceType(service.getServiceType());
            dtos.add(serviceDTO);
        }
        return dtos;
    }

    public UpdateServiceDTO getServiceDataByProviderEmail(String email) {
        User provider = userService.getUserByEmail(email);
        com.example.appointmentsystem.model.Service service = provider.getServices().get(0);
        if (service == null) throw new IllegalArgumentException("No service found for provider email " + email);
        List<WorkingDay> wd = workingDayRepository.findByProviderId(provider.getId());
        List<WorkingDayDTO> workingDayDTOS = new ArrayList<>();
        for (WorkingDay day : wd) {
            WorkingDayDTO workingDayDTO = new WorkingDayDTO(day.getDayOfWeek(), day.getStartTime(), day.getEndTime());
            workingDayDTOS.add(workingDayDTO);
        }
        return new UpdateServiceDTO(service.getId(), service.getServiceType().name(), service.getName(), service.getDescription(),
                service.getPrice(), service.getDurationMinutes(), email, workingDayDTOS);
    }

    public void updateService(Long id, UpdateServiceDTO dto) {
        com.example.appointmentsystem.model.Service service = getById(id);
        service.setServiceType(ServiceType.valueOf(dto.serviceType()));
        service.setDescription(dto.description());
        service.setName(dto.name());
        service.setDurationMinutes(dto.durationMinutes());
        service.setPrice(dto.price());
        User provider = service.getProvider();

        List<WorkingDay> existing = workingDayRepository.findByProviderId(provider.getId());
        Map<DayOfWeek, WorkingDay> byDow = existing.stream()
                .collect(Collectors.toMap(WorkingDay::getDayOfWeek, wd -> wd));

        Map<DayOfWeek, WorkingDayDTO> incoming = dto.workingDays().stream()
                .collect(Collectors.toMap(
                        wd -> toDow(wd.dayOfWeek()),
                        wd -> wd,
                        (a, b) -> b
                ));

        List<WorkingDay> toSave = new ArrayList<>();
        for (Map.Entry<DayOfWeek, WorkingDayDTO> entry : incoming.entrySet()) {
            DayOfWeek dow = entry.getKey();
            WorkingDayDTO dtoDay = entry.getValue();

            WorkingDay current = byDow.remove(dow);
            if (current == null) {
                WorkingDay newDay = new WorkingDay();
                newDay.setProvider(provider);
                newDay.setDayOfWeek(dow);
                newDay.setStartTime(dtoDay.startTime());
                newDay.setEndTime(dtoDay.endTime());
                toSave.add(newDay);
            } else {
                current.setStartTime(dtoDay.startTime());
                current.setEndTime(dtoDay.endTime());
                toSave.add(current);
            }
        }
        if (!byDow.isEmpty()) {
            workingDayRepository.deleteAllInBatch(byDow.values());
        }
        if (!toSave.isEmpty()) {
            workingDayRepository.saveAll(toSave);
        }
        serviceRepository.save(service);
    }

    private DayOfWeek toDow(Object v) {
        if (v instanceof DayOfWeek) {
            return (DayOfWeek) v;
        }
        String s = String.valueOf(v);
        if (s.matches("\\d+")) {
            return DayOfWeek.of(Integer.parseInt(s));
        }
        return DayOfWeek.valueOf(s.toUpperCase(Locale.ROOT));
    }

    public com.example.appointmentsystem.model.Service getById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No service found with " + id));
    }
}
