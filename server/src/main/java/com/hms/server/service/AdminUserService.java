package com.hms.server.service;

import com.hms.server.dto.admin.AdminUserCreateRequest;
import com.hms.server.dto.admin.AdminUserResponse;
import com.hms.server.dto.admin.AdminUserUpdateRequest;
import com.hms.server.model.User;
import com.hms.server.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AdminUserResponse> listUsersByRole(User.Role role) {
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles() != null && u.getRoles().contains(role))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AdminUserResponse createUser(@Valid AdminUserCreateRequest req) {
        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setAddress(req.getAddress());
        user.setDateOfBirth(req.getDateOfBirth());
        user.setRoles(Set.of(req.getRole()));
        user.setApproved(true); // Admin-created users are approved by default
        user.setActive(true);
        user.setSpecialization(req.getSpecialization());
        user.setDepartment(req.getDepartment());
        user.setLicenseNumber(req.getLicenseNumber());
        return toResponse(userRepository.save(user));
    }

    public AdminUserResponse updateUser(String userId, @Valid AdminUserUpdateRequest req) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (req.getUsername() != null) user.setUsername(req.getUsername());
        if (req.getEmail() != null) user.setEmail(req.getEmail());
        if (req.getPassword() != null) user.setPassword(passwordEncoder.encode(req.getPassword()));
        if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
        if (req.getLastName() != null) user.setLastName(req.getLastName());
        if (req.getPhoneNumber() != null) user.setPhoneNumber(req.getPhoneNumber());
        if (req.getAddress() != null) user.setAddress(req.getAddress());
        if (req.getDateOfBirth() != null) user.setDateOfBirth(req.getDateOfBirth());
        if (req.getRole() != null) user.setRoles(Set.of(req.getRole()));
        if (req.getApproved() != null) user.setApproved(req.getApproved());
        if (req.getActive() != null) user.setActive(req.getActive());
        if (req.getSpecialization() != null) user.setSpecialization(req.getSpecialization());
        if (req.getDepartment() != null) user.setDepartment(req.getDepartment());
        if (req.getLicenseNumber() != null) user.setLicenseNumber(req.getLicenseNumber());
        return toResponse(userRepository.save(user));
    }

    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.deleteById(userId);
    }

    private AdminUserResponse toResponse(User u) {
        return new AdminUserResponse(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getFirstName(),
                u.getLastName(),
                u.getPhoneNumber(),
                u.getAddress(),
                u.getDateOfBirth(),
                u.getRoles(),
                u.isApproved(),
                u.isActive(),
                u.getSpecialization(),
                u.getDepartment(),
                u.getLicenseNumber(),
                u.getCreatedAt(),
                u.getUpdatedAt()
        );
    }
}


