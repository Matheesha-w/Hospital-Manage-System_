package com.hms.server.dto;

import jakarta.validation.constraints.NotBlank;

public class MedicationMissedRequest {
    @NotBlank
    private String patientId; // from users collection id

    @NotBlank
    private String prescriptionId;

    @NotBlank
    private String medicationId;

    private String notes;

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(String prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getMedicationId() { return medicationId; }
    public void setMedicationId(String medicationId) { this.medicationId = medicationId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
