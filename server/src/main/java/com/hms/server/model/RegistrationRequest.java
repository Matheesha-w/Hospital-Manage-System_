package com.hms.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "registration_requests")
public class RegistrationRequest {
    
    @Id
    private String id;
    
    @NotBlank
    private String userId;
    
    @NotBlank
    private String username;
    
    @NotBlank
    private String email;
    
    @NotBlank
    private String firstName;
    
    @NotBlank
    private String lastName;
    
    private String phoneNumber;
    private String address;
    private String specialization;
    private String department;
    private String licenseNumber;
    private String linkedinUrl;
    private String cvLocalPath;
    
    private User.Role requestedRole;
    
    private RequestStatus status = RequestStatus.PENDING;
    
    private String adminNotes;
    
    private LocalDateTime requestedAt = LocalDateTime.now();
    private LocalDateTime reviewedAt;
    private String reviewedBy;
    
    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
