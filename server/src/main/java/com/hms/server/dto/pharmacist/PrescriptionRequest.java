package com.hms.server.dto.pharmacist;

import com.hms.server.models.pharmacistModels.Prescription.PrescriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionRequest {
    
    @NotBlank(message = "Patient name is required")
    private String patientName;
    
    private String patientId;
    
    @NotBlank(message = "Doctor name is required")
    private String doctorName;
    
    private String doctorId;
    
    @NotNull(message = "Drug ID is required")
    private String drugId;
    
    private String drugName;
    
    private String dosage;
    
    @NotNull(message = "Quantity is required")
    private Integer quantity;
    
    private String instructions;
    
    private PrescriptionStatus status;
}
