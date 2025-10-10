package com.example.appointmentsystem.model.DTOs;

import com.example.appointmentsystem.model.User;
import com.example.appointmentsystem.model.enums.ServiceType;

public class ServiceDTO {
    private long id;
    private long serviceId;
    private String name;
    private String description;

    private ProvidersNamesDTOs provider;
    private double price;
    private int duration;
    private ServiceType serviceType;

    public ServiceDTO() {
    }

    public ServiceDTO(long id, long serviceId, String name, String description, ProvidersNamesDTOs provider, double price, int duration, ServiceType serviceType) {
        this.id = id;
        this.serviceId = serviceId;
        this.name = name;
        this.description = description;
        this.provider = provider;
        this.price = price;
        this.duration = duration;
        this.serviceType = serviceType;
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getServiceId() {
        return serviceId;
    }

    public void setServiceId(long serviceId) {
        this.serviceId = serviceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProvidersNamesDTOs getProvider() {
        return provider;
    }

    public void setProvider(ProvidersNamesDTOs provider) {
        this.provider = provider;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public ServiceType getServiceType() {
        return serviceType;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }
}
