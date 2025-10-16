package com.hms.server.dto;

import com.hms.server.model.AdministrationRecord;
import java.time.LocalDateTime;

public class AdministrationRecordResponse {
    private String recordId;
    private String patientId;
    private String nurseId;
    private String prescriptionId;
    private String medicationId;
    private String medicationName;
    private Double administeredDosage;  // ✅ FIXED: Double (matches model)
    private String dosageUnit;
    private String notes;
    private String adverseReaction;
    private String status;
    private String verificationCode;
    private LocalDateTime administrationTime;
    private LocalDateTime updatedAt;

    // --- Static Mapper ---
    public static AdministrationRecordResponse fromAdministrationRecord(AdministrationRecord record) {
        AdministrationRecordResponse response = new AdministrationRecordResponse();
        response.setRecordId(record.getRecordId());
        response.setPatientId(record.getPatientId());
        response.setNurseId(record.getNurseId());
        response.setPrescriptionId(record.getPrescriptionId());
        response.setMedicationId(record.getMedicationId());
        response.setMedicationName(record.getMedicationName());
        response.setAdministeredDosage(record.getAdministeredDosage()); // ✅ now both Double
        response.setDosageUnit(record.getDosageUnit());
        response.setNotes(record.getNotes());
        response.setAdverseReaction(record.getAdverseReaction());
        response.setStatus(record.getStatus() != null ? record.getStatus().name() : null);
        response.setVerificationCode(record.getVerificationCode());
        response.setAdministrationTime(record.getAdministrationTime());
        response.setUpdatedAt(record.getUpdatedAt());
        return response;
    }

    // --- Getters and Setters ---
    public String getRecordId() { return recordId; }
    public void setRecordId(String recordId) { this.recordId = recordId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getNurseId() { return nurseId; }
    public void setNurseId(String nurseId) { this.nurseId = nurseId; }

    public String getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(String prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getMedicationId() { return medicationId; }
    public void setMedicationId(String medicationId) { this.medicationId = medicationId; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public Double getAdministeredDosage() { return administeredDosage; }
    public void setAdministeredDosage(Double administeredDosage) { this.administeredDosage = administeredDosage; }

    public String getDosageUnit() { return dosageUnit; }
    public void setDosageUnit(String dosageUnit) { this.dosageUnit = dosageUnit; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getAdverseReaction() { return adverseReaction; }
    public void setAdverseReaction(String adverseReaction) { this.adverseReaction = adverseReaction; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }

    public LocalDateTime getAdministrationTime() { return administrationTime; }
    public void setAdministrationTime(LocalDateTime administrationTime) { this.administrationTime = administrationTime; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
