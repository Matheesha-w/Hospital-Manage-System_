package com.hms.server.service;

import com.hms.server.dto.*;
import com.hms.server.model.RegistrationRequest;
import com.hms.server.model.User;
import com.hms.server.repository.RegistrationRequestRepository;
import com.hms.server.repository.UserRepository;
import com.hms.server.security.JwtTokenProvider;
import com.hms.server.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

// no-op
import java.util.Set;
// no-op

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RegistrationRequestRepository registrationRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    // CV upload removed

    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new JwtAuthenticationResponse(
                jwt,
                "Bearer",
                userPrincipal.getUsername(),
                userPrincipal.getEmail(),
                user.getRoles().stream().map(Enum::name).collect(java.util.stream.Collectors.toSet()),
                user.isApproved()
        );
    }

    public ApiResponse registerUser(SignUpRequest signUpRequest, MultipartFile cvFile) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return new ApiResponse(false, "Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new ApiResponse(false, "Email is already in use!");
        }

        // Validate role
        if (signUpRequest.getRole() == null) {
            return new ApiResponse(false, "Role is required!");
        }

        // CV no longer required for staff roles

        try {
            User user = new User();
            user.setUsername(signUpRequest.getUsername());
            user.setEmail(signUpRequest.getEmail());
            user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
            user.setFirstName(signUpRequest.getFirstName());
            user.setLastName(signUpRequest.getLastName());
            user.setPhoneNumber(signUpRequest.getPhoneNumber());
            user.setAddress(signUpRequest.getAddress());
            user.setDateOfBirth(signUpRequest.getDateOfBirth());
            user.setSpecialization(signUpRequest.getSpecialization());
            user.setDepartment(signUpRequest.getDepartment());
            user.setLicenseNumber(signUpRequest.getLicenseNumber());
            user.setLinkedinUrl(signUpRequest.getLinkedinUrl());
            user.setCvLocalPath(signUpRequest.getCvLocalPath());
            user.setRoles(Set.of(signUpRequest.getRole()));

            // CV upload removed

            // Set approval status based on role
            if (signUpRequest.getRole() == User.Role.PATIENT) {
                user.setApproved(true); // Patients are auto-approved
            } else {
                user.setApproved(false); // Staff needs admin approval
            }

            User savedUser = userRepository.save(user);

            // Create registration request for staff
            if (signUpRequest.getRole() != User.Role.PATIENT) {
                RegistrationRequest request = new RegistrationRequest();
                request.setUserId(savedUser.getId());
                request.setUsername(savedUser.getUsername());
                request.setEmail(savedUser.getEmail());
                request.setFirstName(savedUser.getFirstName());
                request.setLastName(savedUser.getLastName());
                request.setPhoneNumber(savedUser.getPhoneNumber());
                request.setAddress(savedUser.getAddress());
                request.setSpecialization(savedUser.getSpecialization());
                request.setDepartment(savedUser.getDepartment());
                request.setLicenseNumber(savedUser.getLicenseNumber());
                request.setLinkedinUrl(savedUser.getLinkedinUrl());
                request.setCvLocalPath(savedUser.getCvLocalPath());
                request.setRequestedRole(signUpRequest.getRole());

                registrationRequestRepository.save(request);
                log.info("Staff registration request created: {}", savedUser.getUsername());
            } else {
                log.info("Patient registered successfully: {}", savedUser.getUsername());
            }

            String message = signUpRequest.getRole() == User.Role.PATIENT 
                ? "Registration successful! You can now login."
                : "Registration request submitted successfully. Waiting for admin approval.";

            return new ApiResponse(true, message, savedUser);

        } catch (Exception e) {
            log.error("Error during registration", e);
            return new ApiResponse(false, "Registration failed: " + e.getMessage());
        }
    }


    // CV handling removed


    public ApiResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ApiResponse(false, "User not authenticated");
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new ApiResponse(true, "User details retrieved successfully", user);
    }
}

