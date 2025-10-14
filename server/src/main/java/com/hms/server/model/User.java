package com.hms.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Indexed(unique = true)
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Indexed(unique = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    private String phoneNumber;
    
    private String address;
    
    private LocalDate dateOfBirth;
    
    private Set<Role> roles;
    
    private boolean isApproved = false;
    
    private boolean isActive = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // For staff members only
    private String cvFileName;
    private String cvFilePath;
    private String specialization; // For doctors
    private String department; // For nurses and lab technicians
    private String licenseNumber; // For doctors
    private LocalDateTime cvUploadedAt;
    
    public enum Role {
        ADMIN,
        PATIENT,
        DOCTOR,
        NURSE,
        LAB_TECHNICIAN
    }
    
    public boolean hasRole(Role role) {
        return roles != null && roles.contains(role);
    }
    
    public boolean isStaff() {
        return roles != null && (roles.contains(Role.DOCTOR) || 
                                roles.contains(Role.NURSE) || 
                                roles.contains(Role.LAB_TECHNICIAN));
    }
}
