package com.hms.server.dto.pharmacist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubstitutionRequest {
    
    @NotBlank(message = "Substitution reason is required")
    private String substitutionReason;
    
    private String requestedDrugId;
    
    private String requestedDrugName;
}
