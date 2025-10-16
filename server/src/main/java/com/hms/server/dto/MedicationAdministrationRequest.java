package com.hms.server.dto;

public class MedicationAdministrationRequest {
    private String patientId;
    private String prescriptionId;
    private String medicationId;
    private Double administeredDosage; // ✅ Keep this as Double
    private String dosageUnit;
    private String notes;
    private String adverseReaction;
    private String verificationCode;

    // --- Getters and Setters ---
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(String prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getMedicationId() { return medicationId; }
    public void setMedicationId(String medicationId) { this.medicationId = medicationId; }

    // ✅ FIXED: match type Double in both getter and setter
    public Double getAdministeredDosage() { return administeredDosage; }
    public void setAdministeredDosage(Double administeredDosage) { this.administeredDosage = administeredDosage; }

    public String getDosageUnit() { return dosageUnit; }
    public void setDosageUnit(String dosageUnit) { this.dosageUnit = dosageUnit; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getAdverseReaction() { return adverseReaction; }
    public void setAdverseReaction(String adverseReaction) { this.adverseReaction = adverseReaction; }

    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
}
