package com.example.appointmentsystem.controller;

import com.example.appointmentsystem.model.DTOs.*;
import com.example.appointmentsystem.model.enums.Role;
import com.example.appointmentsystem.service.ApplicationUserDetailsService;
import com.example.appointmentsystem.service.UserService;
import com.example.appointmentsystem.util.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserApi {

    private final AuthenticationManager authenticationManager;

    private final UserService userService;

    private final JwtUtils jwt;

    @Autowired
    public UserApi(AuthenticationManager authenticationManager, UserService userService, JwtUtils jwt) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwt = jwt;
    }

    @PostMapping("/api/register/client")
    public ResponseEntity<String> register(@RequestBody() RegisterClientDTO dto) {
        if (userService.isEmailExist(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        userService.registerClient(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Client registered successfully");
    }

    @PostMapping("/api/register/provider")
    public ResponseEntity<String> registerProvider(@RequestBody() RegisterClientDTO dto) {
        if (userService.isEmailExist(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        userService.registerProvider(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Client registered successfully");
    }

    @PostMapping("/api/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginDTO dto) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
            );
            String email = auth.getName();
            String role = userService.getUserRoles(email);
            String token = jwt.generateToken(email, role);

            return ResponseEntity.ok(new JwtResponse(token, email, role));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/api/all-providers")
    public ResponseEntity<List<ProvidersNamesDTOs>> getAllProviders() {
        List<ProvidersNamesDTOs> providers = userService.getAllByRole(Role.PROVIDER);
        return ResponseEntity.ok(providers);
    }

    @GetMapping("/api/user/profile")
    public ResponseEntity<ProfileDTO> getProfileData(HttpServletRequest request) {
        String token = jwt.getTokenFromRequest(request);
        String email = jwt.extractEmail(token);
        ProfileDTO dto =  userService.getProfileData(email);
        return ResponseEntity.ok(dto);
    }
}
