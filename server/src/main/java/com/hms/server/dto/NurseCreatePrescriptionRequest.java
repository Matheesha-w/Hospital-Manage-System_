package com.hms.server.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class NurseCreatePrescriptionRequest {
    @NotBlank
    private String patientEmail;

    // Either medicationId or medicationName should be provided; we'll accept name for nurse flow
    private String medicationId;

    @NotBlank
    private String medicationName;

    @NotNull
    @Positive
    private Double dosage;

    @NotBlank
    private String dosageUnit;

    @NotBlank
    private String frequency; // free text

    @NotNull
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @NotNull
    @Positive
    private Integer totalQuantity;

    private String instructions;
    private String notes;

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public String getMedicationId() { return medicationId; }
    public void setMedicationId(String medicationId) { this.medicationId = medicationId; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public Double getDosage() { return dosage; }
    public void setDosage(Double dosage) { this.dosage = dosage; }

    public String getDosageUnit() { return dosageUnit; }
    public void setDosageUnit(String dosageUnit) { this.dosageUnit = dosageUnit; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Integer getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
