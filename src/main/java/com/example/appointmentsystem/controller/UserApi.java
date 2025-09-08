package com.example.appointmentsystem.controller;

import com.example.appointmentsystem.model.DTOs.JwtResponse;
import com.example.appointmentsystem.model.DTOs.LoginDTO;
import com.example.appointmentsystem.model.DTOs.RegisterClientDTO;
import com.example.appointmentsystem.model.enums.Role;
import com.example.appointmentsystem.service.ApplicationUserDetailsService;
import com.example.appointmentsystem.service.UserService;
import com.example.appointmentsystem.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserApi {

    private final AuthenticationManager authenticationManager;

    private final UserService userService;

    private final ApplicationUserDetailsService userDetailsService;

    private final JwtUtils jwt;

    @Autowired
    public UserApi(AuthenticationManager authenticationManager, UserService userService, ApplicationUserDetailsService userDetailsService, JwtUtils jwt) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.userDetailsService = userDetailsService;
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
}
