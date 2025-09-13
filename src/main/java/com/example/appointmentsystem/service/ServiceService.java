package com.example.appointmentsystem.service;

import com.example.appointmentsystem.model.DTOs.RegisterServiceDTO;
import com.example.appointmentsystem.model.DTOs.ServiceDTO;
import com.example.appointmentsystem.model.User;
import com.example.appointmentsystem.model.WorkingDay;
import com.example.appointmentsystem.model.enums.Role;
import com.example.appointmentsystem.model.enums.ServiceType;
import com.example.appointmentsystem.repository.ServiceRepository;
import com.example.appointmentsystem.repository.WorkingDayRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
            ServiceDTO serviceDTO = new ServiceDTO();
            serviceDTO.setServiceId(service.getId());
            serviceDTO.setName(service.getName());
            serviceDTO.setDescription(service.getDescription());
            //TODO:setUser
            serviceDTO.setPrice(service.getPrice());
            serviceDTO.setDuration(service.getDurationMinutes());
            serviceDTO.setServiceType(service.getServiceType());
            dtos.add(serviceDTO);
        }
        return dtos;
    }
}
