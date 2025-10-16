package com.hms.server.service.pharmacist;

import com.hms.server.dto.pharmacist.DispensePrescriptionRequest;
import com.hms.server.dto.pharmacist.PrescriptionRequest;
import com.hms.server.dto.pharmacist.PrescriptionResponse;
import com.hms.server.dto.pharmacist.SubstitutionRequest;
import com.hms.server.models.pharmacistModels.Drug;
import com.hms.server.models.pharmacistModels.Prescription;
import com.hms.server.models.pharmacistModels.Prescription.PrescriptionStatus;
import com.hms.server.repository.pharmacist.DrugRepository;
import com.hms.server.repository.pharmacist.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of PrescriptionService
 * Follows Single Responsibility Principle - handles only prescription workflow logic
 * Follows Dependency Inversion Principle - depends on repository abstractions
 */
@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {
    
    private final PrescriptionRepository prescriptionRepository;
    private final DrugRepository drugRepository;
    
    @Override
    public List<PrescriptionResponse> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public PrescriptionResponse getPrescriptionById(String id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        return mapToResponse(prescription);
    }
    
    @Override
    public PrescriptionResponse createPrescription(PrescriptionRequest request) {
        // Verify drug exists
        Drug drug = drugRepository.findById(request.getDrugId())
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + request.getDrugId()));
        
        Prescription prescription = new Prescription();
        prescription.setPatientName(request.getPatientName());
        prescription.setPatientId(request.getPatientId());
        prescription.setDoctorName(request.getDoctorName());
        prescription.setDoctorId(request.getDoctorId());
        prescription.setDrugId(request.getDrugId());
        prescription.setDrugName(drug.getName());
        prescription.setDosage(request.getDosage() != null ? request.getDosage() : drug.getDosage());
        prescription.setQuantity(request.getQuantity());
        prescription.setInstructions(request.getInstructions());
        prescription.setStatus(PrescriptionStatus.PENDING);
        prescription.setCreatedAt(LocalDateTime.now());
        prescription.setUpdatedAt(LocalDateTime.now());
        
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return mapToResponse(savedPrescription);
    }
    
    @Override
    public PrescriptionResponse updatePrescription(String id, PrescriptionRequest request) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        
        // Verify drug exists
        Drug drug = drugRepository.findById(request.getDrugId())
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + request.getDrugId()));
        
        prescription.setPatientName(request.getPatientName());
        prescription.setPatientId(request.getPatientId());
        prescription.setDoctorName(request.getDoctorName());
        prescription.setDoctorId(request.getDoctorId());
        prescription.setDrugId(request.getDrugId());
        prescription.setDrugName(drug.getName());
        prescription.setDosage(request.getDosage() != null ? request.getDosage() : drug.getDosage());
        prescription.setQuantity(request.getQuantity());
        prescription.setInstructions(request.getInstructions());
        prescription.setUpdatedAt(LocalDateTime.now());
        
        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        return mapToResponse(updatedPrescription);
    }
    
    @Override
    public void deletePrescription(String id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new RuntimeException("Prescription not found with id: " + id);
        }
        prescriptionRepository.deleteById(id);
    }
    
    @Override
    public List<PrescriptionResponse> getPrescriptionsByStatus(PrescriptionStatus status) {
        return prescriptionRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PrescriptionResponse> getPrescriptionsByPatientId(String patientId) {
        return prescriptionRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PrescriptionResponse> getPrescriptionsByPharmacistId(String pharmacistId) {
        return prescriptionRepository.findByPharmacistId(pharmacistId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public PrescriptionResponse dispensePrescription(String id, DispensePrescriptionRequest request) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        
        // Check if already dispensed
        if (prescription.getStatus() == PrescriptionStatus.DISPENSED) {
            throw new RuntimeException("Prescription already dispensed");
        }
        
        // Verify drug availability
        Drug drug = drugRepository.findById(prescription.getDrugId())
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + prescription.getDrugId()));
        
        if (drug.getQuantity() < prescription.getQuantity()) {
            throw new RuntimeException("Insufficient drug quantity. Available: " + drug.getQuantity() + 
                    ", Required: " + prescription.getQuantity());
        }
        
        // Update drug quantity
        drug.setQuantity(drug.getQuantity() - prescription.getQuantity());
        drug.setStatus(drug.checkStockStatus());
        drug.setUpdatedAt(LocalDateTime.now());
        drugRepository.save(drug);
        
        // Update prescription
        prescription.setStatus(PrescriptionStatus.DISPENSED);
        prescription.setPharmacistId(request.getPharmacistId());
        prescription.setPharmacistName(request.getPharmacistName());
        prescription.setDispensedAt(LocalDateTime.now());
        prescription.setUpdatedAt(LocalDateTime.now());
        
        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        return mapToResponse(updatedPrescription);
    }
    
    @Override
    public PrescriptionResponse requestSubstitution(String id, SubstitutionRequest request) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        
        prescription.setStatus(PrescriptionStatus.SUBSTITUTION_REQUESTED);
        prescription.setSubstitutionReason(request.getSubstitutionReason());
        prescription.setSubstitutionRequest(request.getRequestedDrugName());
        prescription.setUpdatedAt(LocalDateTime.now());
        
        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        return mapToResponse(updatedPrescription);
    }
    
    @Override
    public PrescriptionResponse cancelPrescription(String id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        
        prescription.setStatus(PrescriptionStatus.CANCELLED);
        prescription.setUpdatedAt(LocalDateTime.now());
        
        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        return mapToResponse(updatedPrescription);
    }
    
    /**
     * Helper method to map Prescription entity to PrescriptionResponse DTO
     */
    private PrescriptionResponse mapToResponse(Prescription prescription) {
        PrescriptionResponse response = new PrescriptionResponse();
        response.setId(prescription.getId());
        response.setPatientName(prescription.getPatientName());
        response.setPatientId(prescription.getPatientId());
        response.setDoctorName(prescription.getDoctorName());
        response.setDoctorId(prescription.getDoctorId());
        response.setDrugId(prescription.getDrugId());
        response.setDrugName(prescription.getDrugName());
        response.setDosage(prescription.getDosage());
        response.setQuantity(prescription.getQuantity());
        response.setInstructions(prescription.getInstructions());
        response.setStatus(prescription.getStatus());
        response.setPharmacistId(prescription.getPharmacistId());
        response.setPharmacistName(prescription.getPharmacistName());
        response.setDispensedAt(prescription.getDispensedAt());
        response.setSubstitutionRequest(prescription.getSubstitutionRequest());
        response.setSubstitutionReason(prescription.getSubstitutionReason());
        response.setCreatedAt(prescription.getCreatedAt());
        response.setUpdatedAt(prescription.getUpdatedAt());
        return response;
    }
}
