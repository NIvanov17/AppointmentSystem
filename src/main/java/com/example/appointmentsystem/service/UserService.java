package com.example.appointmentsystem.service;

import com.example.appointmentsystem.model.DTOs.ProfileDTO;
import com.example.appointmentsystem.model.DTOs.ProvidersNamesDTOs;
import com.example.appointmentsystem.model.DTOs.RegisterClientDTO;
import com.example.appointmentsystem.model.User;

import com.example.appointmentsystem.model.enums.Role;
import com.example.appointmentsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public void registerClient(RegisterClientDTO dto) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.CLIENT);

        userRepository.save(user);
    }

    public boolean isEmailExist(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public String getUserRoles(String email) {
        User user = getUserByEmail(email);
        return user.getRole().name();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public void registerProvider(RegisterClientDTO dto) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.PROVIDER);

        userRepository.save(user);
    }

    public List<ProvidersNamesDTOs> getAllByRole(Role role) {
        List<User> users = userRepository.getAllByRole(role);
        List<ProvidersNamesDTOs> dtos = new ArrayList<>();
        users.forEach(user -> {
            ProvidersNamesDTOs dto = new ProvidersNamesDTOs(user.getId(), user.getFirstName(), user.getLastName());
            dtos.add(dto);
        });
        return dtos;
    }

    public User getUserById(Long providerId) {
        return userRepository.findById(providerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public ProfileDTO getProfileData(String email) {
        User user = getUserByEmail(email);
        return new ProfileDTO(user.getFirstName(), user.getLastName(), user.getEmail());
    }
}
