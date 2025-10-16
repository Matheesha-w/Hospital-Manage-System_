package com.hms.server.dto.pharmacist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DispensePrescriptionRequest {
    
    @NotBlank(message = "Pharmacist ID is required")
    private String pharmacistId;
    
    @NotBlank(message = "Pharmacist name is required")
    private String pharmacistName;
}
