package com.hms.server.service;

import com.hms.server.dto.*;
import com.hms.server.model.*;
import com.hms.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class NurseService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    
    @Autowired
    private MedicationRepository medicationRepository;
    
    @Autowired
    private AdministrationRecordRepository administrationRecordRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Patient search functionality
    public List<PatientResponse> searchPatients(PatientSearchRequest request) {
        List<Patient> patients;
        
        switch (request.getSearchType().toUpperCase()) {
            case "NAME":
                patients = patientRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                    request.getSearchTerm(), request.getSearchTerm());
                break;
            case "ID":
                patients = patientRepository.findByPatientId(request.getSearchTerm())
                    .map(List::of).orElse(List.of());
                break;
            case "EMAIL":
                patients = patientRepository.findByEmail(request.getSearchTerm())
                    .map(List::of).orElse(List.of());
                break;
            default:
                patients = patientRepository.findBySearchTerm(request.getSearchTerm());
        }
        
        return patients.stream()
            .filter(Patient::isActive)
            .map(PatientResponse::fromPatient)
            .collect(Collectors.toList());
    }
    
    // Get patient by ID
    public Optional<PatientResponse> getPatientById(String patientId) {
        return patientRepository.findByPatientId(patientId)
            .filter(Patient::isActive)
            .map(PatientResponse::fromPatient);
    }
    
    // Get active prescriptions for a patient
    public List<PrescriptionResponse> getActivePrescriptions(String patientId) {
        List<Prescription> prescriptions = prescriptionRepository
            .findActivePrescriptionsForPatient(patientId, LocalDateTime.now());
        
        return prescriptions.stream()
            .map(PrescriptionResponse::fromPrescription)
            .collect(Collectors.toList());
    }
    
    // Validate medication administration
    public ValidationResult validateMedicationAdministration(MedicationAdministrationRequest request) {
        ValidationResult result = new ValidationResult();
        
        // Check if patient exists and is active
        Optional<Patient> patient = patientRepository.findByPatientId(request.getPatientId());
        if (patient.isEmpty() || !patient.get().isActive()) {
            result.addError("Patient not found or inactive");
            return result;
        }
        
        // Check if prescription exists and is valid
        Optional<Prescription> prescription = prescriptionRepository
            .findValidPrescriptionForAdministration(request.getPatientId(), request.getMedicationId());
        
        if (prescription.isEmpty()) {
            result.addError("No valid prescription found for this medication");
            return result;
        }
        
        // Validate dosage
        if (!request.getAdministeredDosage().equals(prescription.get().getDosage())) {
            result.addError("Administered dosage does not match prescribed dosage");
        }
        
        // Validate dosage unit
        if (!request.getDosageUnit().equals(prescription.get().getDosageUnit())) {
            result.addError("Dosage unit does not match prescription");
        }
        
        // Check for allergies
        if (patient.get().getAllergies() != null) {
            Optional<Medication> medication = medicationRepository.findById(request.getMedicationId());
            if (medication.isPresent() && patient.get().getAllergies().contains(medication.get().getName())) {
                result.addError("Patient has allergy to this medication");
            }
        }
        
        // Check timing constraints (basic implementation)
        List<AdministrationRecord> recentAdministrations = administrationRecordRepository
            .findRecentAdministrationsForPatientAndMedication(
                request.getPatientId(), 
                request.getMedicationId(), 
                LocalDateTime.now().minusHours(1)
            );
        
        if (!recentAdministrations.isEmpty()) {
            result.addWarning("Medication was administered recently. Please verify timing.");
        }
        
        return result;
    }
    
    // Administer medication
    public AdministrationRecordResponse administerMedication(MedicationAdministrationRequest request, String nurseId) {
        // Validate administration
        ValidationResult validation = validateMedicationAdministration(request);
        if (!validation.isValid()) {
            throw new IllegalArgumentException("Validation failed: " + String.join(", ", validation.getErrors()));
        }
        
        // Get prescription and medication details
        Prescription prescription = prescriptionRepository
            .findValidPrescriptionForAdministration(request.getPatientId(), request.getMedicationId())
            .orElseThrow(() -> new IllegalArgumentException("Valid prescription not found"));
        
        Medication medication = medicationRepository.findById(request.getMedicationId())
            .orElseThrow(() -> new IllegalArgumentException("Medication not found"));
        
        // Create administration record
        AdministrationRecord record = new AdministrationRecord();
        record.setRecordId(UUID.randomUUID().toString());
        record.setPatientId(request.getPatientId());
        record.setNurseId(nurseId);
        record.setPrescriptionId(request.getPrescriptionId());
        record.setMedicationId(request.getMedicationId());
        record.setMedicationName(medication.getName());
        record.setAdministeredDosage(request.getAdministeredDosage());
        record.setDosageUnit(request.getDosageUnit());
        record.setAdministrationTime(LocalDateTime.now());
        record.setNotes(request.getNotes());
        record.setAdverseReaction(request.getAdverseReaction());
        record.setStatus(AdministrationRecord.AdministrationStatus.COMPLETED);
        record.setVerificationCode(request.getVerificationCode());
        
        // Save administration record
        AdministrationRecord savedRecord = administrationRecordRepository.save(record);
        
        // Update prescription remaining quantity
        if (prescription.getRemainingQuantity() != null) {
            prescription.setRemainingQuantity(prescription.getRemainingQuantity() - 1);
            if (prescription.getRemainingQuantity() <= 0) {
                prescription.setStatus(Prescription.PrescriptionStatus.COMPLETED);
            }
            prescriptionRepository.save(prescription);
        }
        
        return AdministrationRecordResponse.fromAdministrationRecord(savedRecord);
    }
    
    // Get administration history for a patient
    public List<AdministrationRecordResponse> getAdministrationHistory(String patientId) {
        List<AdministrationRecord> records = administrationRecordRepository.findByPatientId(patientId);
        return records.stream()
            .map(AdministrationRecordResponse::fromAdministrationRecord)
            .collect(Collectors.toList());
    }
    
    // Get administration history for a nurse
    public List<AdministrationRecordResponse> getNurseAdministrationHistory(String nurseId) {
        List<AdministrationRecord> records = administrationRecordRepository.findByNurseId(nurseId);
        return records.stream()
            .map(AdministrationRecordResponse::fromAdministrationRecord)
            .collect(Collectors.toList());
    }
    
    // Get dashboard statistics for a nurse
    public Map<String, Object> getDashboardStats(String nurseId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Get total patients (active patients in the system)
        long totalPatients = patientRepository.countByIsActiveTrue();
        stats.put("totalPatients", totalPatients);
        
        // Get pending administrations (prescriptions that need to be administered today)
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        
        List<Prescription> activePrescriptions = prescriptionRepository.findActivePrescriptionsForToday(startOfDay, endOfDay);
        long pendingAdministrations = activePrescriptions.size();
        stats.put("pendingAdministrations", pendingAdministrations);
        
        // Get completed administrations today by this nurse
        List<AdministrationRecord> completedToday = administrationRecordRepository
            .findByNurseIdAndAdministrationTimeBetween(nurseId, startOfDay, endOfDay);
        long completedTodayCount = completedToday.size();
        stats.put("completedToday", completedTodayCount);
        
        // Get adverse reactions reported by this nurse
        List<AdministrationRecord> adverseReactions = administrationRecordRepository
            .findByNurseIdAndAdverseReactionIsNotNull(nurseId);
        long adverseReactionsCount = adverseReactions.size();
        stats.put("adverseReactions", adverseReactionsCount);
        
        return stats;
    }
    
    // Report adverse reaction
    public AdministrationRecordResponse reportAdverseReaction(String recordId, String adverseReaction) {
        AdministrationRecord record = administrationRecordRepository.findByRecordId(recordId)
            .orElseThrow(() -> new IllegalArgumentException("Administration record not found"));
        
        record.setAdverseReaction(adverseReaction);
        record.setUpdatedAt(LocalDateTime.now());
        
        AdministrationRecord updatedRecord = administrationRecordRepository.save(record);
        return AdministrationRecordResponse.fromAdministrationRecord(updatedRecord);
    }
    
    // Validation result class
    public static class ValidationResult {
        private boolean valid = true;
        private List<String> errors = new java.util.ArrayList<>();
        private List<String> warnings = new java.util.ArrayList<>();
        
        public void addError(String error) {
            errors.add(error);
            valid = false;
        }
        
        public void addWarning(String warning) {
            warnings.add(warning);
        }
        
        public boolean isValid() {
            return valid;
        }
        
        public List<String> getErrors() {
            return errors;
        }
        
        public List<String> getWarnings() {
            return warnings;
        }
    }
}

