package com.hms.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "medications")
public class Medication {
    
    @Id
    private String id;
    
    @NotBlank(message = "Medication name is required")
    @Indexed(unique = true)
    private String name;
    
    private String genericName;
    
    @NotBlank(message = "Medication type is required")
    private String type; // e.g., "Tablet", "Injection", "Syrup", "Capsule"
    
    @NotNull(message = "Dosage strength is required")
    @Positive(message = "Dosage strength must be positive")
    private Double dosageStrength;
    
    @NotBlank(message = "Dosage unit is required")
    private String dosageUnit; // e.g., "mg", "ml", "mcg"
    
    private String description;
    
    private List<String> contraindications; // Conditions where medication should not be used
    
    private List<String> sideEffects; // Common side effects
    
    private String manufacturer;
    
    private String batchNumber;
    
    private LocalDateTime expiryDate;
    
    private boolean isControlledSubstance = false; // For controlled medications
    
    private boolean isActive = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public String getFullDosage() {
        return dosageStrength + " " + dosageUnit;
    }
}

