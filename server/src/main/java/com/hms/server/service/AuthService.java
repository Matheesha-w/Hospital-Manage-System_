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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RegistrationRequestRepository registrationRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final String uploadDir = "uploads/cv";

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

        // Check if CV is required for staff roles
        if (signUpRequest.getRole() != User.Role.PATIENT && (cvFile == null || cvFile.isEmpty())) {
            return new ApiResponse(false, "CV file is required for staff registration!");
        }

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
            user.setRoles(Set.of(signUpRequest.getRole()));

            // Handle CV upload for staff
            if (signUpRequest.getRole() != User.Role.PATIENT && cvFile != null) {
                String cvFileName = saveCvFile(cvFile);
                String cvFilePath = uploadDir + "/" + cvFileName;
                user.setCvFileName(cvFileName);
                user.setCvFilePath(cvFilePath);
                user.setCvUploadedAt(LocalDateTime.now());
            }

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
                request.setCvFileName(savedUser.getCvFileName());
                request.setCvFilePath(savedUser.getCvFilePath());
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

        } catch (IOException e) {
            log.error("Error saving CV file", e);
            return new ApiResponse(false, "Error saving CV file: " + e.getMessage());
        }
    }


    private String saveCvFile(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IOException("Original filename is null");
        }
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }


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
