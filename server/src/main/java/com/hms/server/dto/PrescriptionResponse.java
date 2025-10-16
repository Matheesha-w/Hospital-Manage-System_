package com.hms.server.dto;

import com.hms.server.model.Prescription;
import java.time.LocalDateTime;

public class PrescriptionResponse {
    private String prescriptionId;
    private String patientId;
    private String medicationId;
    private String medicationName;
    private Double dosage;              // ✅ Fixed type (Double instead of String)
    private String dosageUnit;
    private int frequencyPerDay;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String instructions;
    private Integer remainingQuantity;
    private String status;

    // ✅ Static converter from entity to DTO
    public static PrescriptionResponse fromPrescription(Prescription prescription) {
        PrescriptionResponse response = new PrescriptionResponse();
        response.setPrescriptionId(prescription.getPrescriptionId());
        response.setPatientId(prescription.getPatientId());
        response.setMedicationId(prescription.getMedicationId());
        response.setMedicationName(prescription.getMedicationName());
        response.setDosage(prescription.getDosage());             // ✅ Works now (Double → Double)
        response.setDosageUnit(prescription.getDosageUnit());
        response.setFrequencyPerDay(prescription.getFrequencyPerDay());
        response.setStartDate(prescription.getStartDate());
        response.setEndDate(prescription.getEndDate());
        response.setInstructions(prescription.getInstructions());
        response.setRemainingQuantity(prescription.getRemainingQuantity());
        response.setStatus(prescription.getStatus().name());
        return response;
    }

    // ✅ Getters and Setters
    public String getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(String prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getMedicationId() { return medicationId; }
    public void setMedicationId(String medicationId) { this.medicationId = medicationId; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public Double getDosage() { return dosage; }
    public void setDosage(Double dosage) { this.dosage = dosage; }

    public String getDosageUnit() { return dosageUnit; }
    public void setDosageUnit(String dosageUnit) { this.dosageUnit = dosageUnit; }

    public int getFrequencyPerDay() { return frequencyPerDay; }
    public void setFrequencyPerDay(int frequencyPerDay) { this.frequencyPerDay = frequencyPerDay; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public Integer getRemainingQuantity() { return remainingQuantity; }
    public void setRemainingQuantity(Integer remainingQuantity) { this.remainingQuantity = remainingQuantity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
