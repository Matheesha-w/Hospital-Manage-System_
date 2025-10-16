package com.hms.server.service.pharmacist;

import com.hms.server.dto.pharmacist.DispensePrescriptionRequest;
import com.hms.server.dto.pharmacist.PrescriptionRequest;
import com.hms.server.dto.pharmacist.PrescriptionResponse;
import com.hms.server.dto.pharmacist.SubstitutionRequest;
import com.hms.server.models.pharmacistModels.Prescription.PrescriptionStatus;

import java.util.List;

/**
 * Service interface for Prescription management
 * Follows Interface Segregation Principle - contains only prescription-related operations
 */
public interface PrescriptionService {
    
    /**
     * Get all prescriptions
     */
    List<PrescriptionResponse> getAllPrescriptions();
    
    /**
     * Get prescription by ID
     */
    PrescriptionResponse getPrescriptionById(String id);
    
    /**
     * Create new prescription
     */
    PrescriptionResponse createPrescription(PrescriptionRequest request);
    
    /**
     * Update prescription
     */
    PrescriptionResponse updatePrescription(String id, PrescriptionRequest request);
    
    /**
     * Delete prescription
     */
    void deletePrescription(String id);
    
    /**
     * Get prescriptions by status
     */
    List<PrescriptionResponse> getPrescriptionsByStatus(PrescriptionStatus status);
    
    /**
     * Get prescriptions by patient ID
     */
    List<PrescriptionResponse> getPrescriptionsByPatientId(String patientId);
    
    /**
     * Get prescriptions by pharmacist ID
     */
    List<PrescriptionResponse> getPrescriptionsByPharmacistId(String pharmacistId);
    
    /**
     * Dispense prescription
     */
    PrescriptionResponse dispensePrescription(String id, DispensePrescriptionRequest request);
    
    /**
     * Request substitution for a prescription
     */
    PrescriptionResponse requestSubstitution(String id, SubstitutionRequest request);
    
    /**
     * Cancel prescription
     */
    PrescriptionResponse cancelPrescription(String id);
}
