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
@Document(collection = "prescriptions")
public class Prescription {

    @Id
    private String id;

    @NotBlank(message = "Prescription ID is required")
    private String prescriptionId;

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Doctor ID is required")
    private String doctorId;

    @NotBlank(message = "Medication ID is required")
    private String medicationId;

    @NotBlank(message = "Medication name is required")
    private String medicationName;

    @NotNull(message = "Dosage is required")
    @Positive(message = "Dosage must be positive")
    private Double dosage;

    @NotBlank(message = "Dosage unit is required")
    private String dosageUnit;

    @NotBlank(message = "Frequency is required")
    private String frequency; // e.g., "Every 8 hours", "Twice daily", "As needed"

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @NotNull(message = "Total quantity is required")
    @Positive(message = "Total quantity must be positive")
    private Integer totalQuantity;

    private Integer remainingQuantity;

    private String instructions; // Special instructions for administration
    private String notes; // Additional notes from doctor

    private PrescriptionStatus status = PrescriptionStatus.ACTIVE;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    // ✅ FIXED: Added a proper return value
    public int getFrequencyPerDay() {
        // Try to convert the frequency text to a number.
        // This is a simple placeholder logic. Adjust as per your actual format.
        if (frequency == null) {
            return 0;
        }

        String lower = frequency.toLowerCase();

        if (lower.contains("once")) return 1;
        if (lower.contains("twice")) return 2;
        if (lower.contains("3")) return 3;
        if (lower.contains("4")) return 4;
        if (lower.contains("8 hour")) return 3; // roughly every 8 hours
        if (lower.contains("12 hour")) return 2;

        return 1; // default if unknown
    }

    public enum PrescriptionStatus {
        ACTIVE,
        COMPLETED,
        CANCELLED,
        EXPIRED
    }

    public boolean isActive() {
        return status == PrescriptionStatus.ACTIVE &&
                (endDate == null || endDate.isAfter(LocalDateTime.now())) &&
                (remainingQuantity == null || remainingQuantity > 0);
    }

    public String getFullDosage() {
        return dosage + " " + dosageUnit;
    }
}
