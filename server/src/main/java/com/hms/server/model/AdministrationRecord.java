package com.hms.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "administration_records")
public class AdministrationRecord {
    
    @Id
    private String id;
    
    @NotBlank(message = "Record ID is required")
    private String recordId;
    
    @NotBlank(message = "Patient ID is required")
    private String patientId;
    
    @NotBlank(message = "Nurse ID is required")
    private String nurseId;
    
    @NotBlank(message = "Prescription ID is required")
    private String prescriptionId;
    
    @NotBlank(message = "Medication ID is required")
    private String medicationId;
    
    @NotBlank(message = "Medication name is required")
    private String medicationName;
    
    @NotNull(message = "Administered dosage is required")
    @Positive(message = "Administered dosage must be positive")
    private Double administeredDosage;
    
    @NotBlank(message = "Dosage unit is required")
    private String dosageUnit;
    
    @NotNull(message = "Administration time is required")
    private LocalDateTime administrationTime;
    
    private String notes; // Nurse notes about administration
    
    private String adverseReaction; // Any adverse reactions observed
    
    private AdministrationStatus status = AdministrationStatus.COMPLETED;
    
    private String verificationCode; // For double-checking critical medications
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public enum AdministrationStatus {
        PENDING,
        COMPLETED,
        FAILED,
        CANCELLED
    }
    
    public String getFullDosage() {
        return administeredDosage + " " + dosageUnit;
    }
    
    public boolean hasAdverseReaction() {
        return adverseReaction != null && !adverseReaction.trim().isEmpty();
    }
}

