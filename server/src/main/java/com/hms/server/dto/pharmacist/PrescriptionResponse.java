package com.hms.server.dto.pharmacist;

import com.hms.server.models.pharmacistModels.Prescription.PrescriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponse {
    
    private String id;
    private String patientName;
    private String patientId;
    private String doctorName;
    private String doctorId;
    private String drugId;
    private String drugName;
    private String dosage;
    private Integer quantity;
    private String instructions;
    private PrescriptionStatus status;
    private String pharmacistId;
    private String pharmacistName;
    private LocalDateTime dispensedAt;
    private String substitutionRequest;
    private String substitutionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
