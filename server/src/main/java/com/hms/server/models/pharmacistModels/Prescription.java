package com.hms.server.models.pharmacistModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescriptions")
public class Prescription {
    
    @Id
    private String id;
    
    @NotBlank(message = "Patient name is required")
    private String patientName;
    
    private String patientId;
    
    @NotBlank(message = "Doctor name is required")
    private String doctorName;
    
    private String doctorId;
    
    @NotNull(message = "Drug is required")
    private String drugId;
    
    private String drugName;
    
    private String dosage;
    
    @NotNull(message = "Quantity is required")
    private Integer quantity;
    
    private String instructions;
    
    @NotNull(message = "Status is required")
    private PrescriptionStatus status;
    
    private String pharmacistId;
    
    private String pharmacistName;
    
    private LocalDateTime dispensedAt;
    
    private String substitutionRequest;
    
    private String substitutionReason;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public enum PrescriptionStatus {
        PENDING,
        DISPENSED,
        CANCELLED,
        SUBSTITUTION_REQUESTED,
        EXPIRED
    }
}
