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
    
    @Autowired
    private VitalsRepository vitalsRepository;

    @Autowired
    private NurseNoteRepository nurseNoteRepository;
    
    // Create a prescription by patient email (nurse flow)
    public PrescriptionResponse createPrescriptionByPatientEmail(NurseCreatePrescriptionRequest req, String nurseId) {
        User user = userRepository.findByEmail(req.getPatientEmail())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found for email: " + req.getPatientEmail()));
        if (!user.isActive() || !user.hasRole(User.Role.PATIENT)) {
            throw new IllegalArgumentException("Provided email does not belong to an active patient");
        }

        Prescription p = new Prescription();
        p.setId(null);
        p.setPrescriptionId(UUID.randomUUID().toString());
        p.setPatientId(user.getId());
        // Use nurseId as prescriber id in this flow
        p.setDoctorId(nurseId);
        p.setMedicationId(req.getMedicationId());
        p.setMedicationName(req.getMedicationName());
        p.setDosage(req.getDosage());
        p.setDosageUnit(req.getDosageUnit());
        p.setFrequency(req.getFrequency());
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());
        p.setTotalQuantity(req.getTotalQuantity());
        p.setRemainingQuantity(req.getTotalQuantity());
        p.setInstructions(req.getInstructions());
        p.setNotes(req.getNotes());
        p.setStatus(Prescription.PrescriptionStatus.ACTIVE);
        p.setCreatedAt(LocalDateTime.now());
        p.setUpdatedAt(LocalDateTime.now());

        Prescription saved = prescriptionRepository.save(p);
        return PrescriptionResponse.fromPrescription(saved);
    }

    // List prescriptions by patient email
    public List<PrescriptionResponse> listPrescriptionsByPatientEmail(String patientEmail) {
        User user = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found for email: " + patientEmail));
        List<Prescription> list = prescriptionRepository.findByPatientId(user.getId());
        return list.stream().map(PrescriptionResponse::fromPrescription).collect(Collectors.toList());
    }

    // Record vitals by patient email (nurse flow)
    public Vitals recordVitals(VitalsRequest request, String nurseId) {
        User user = userRepository.findByEmail(request.getPatientEmail())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found for email: " + request.getPatientEmail()));
        if (!user.isActive() || !user.hasRole(User.Role.PATIENT)) {
            throw new IllegalArgumentException("Provided email does not belong to an active patient");
        }

        Vitals v = new Vitals();
        v.setId(null);
        v.setVitalId(UUID.randomUUID().toString());
        v.setPatientId(user.getId());
        v.setNurseId(nurseId);
        v.setTemperature(request.getTemperature());
        v.setBloodPressure(request.getBloodPressure());
        v.setPulse(request.getPulse());
        v.setSpo2(request.getSpo2());
        v.setDateTime(request.getDateTime() != null ? request.getDateTime() : LocalDateTime.now());
        v.setNotes(request.getNotes());
        v.setCreatedAt(LocalDateTime.now());
        v.setUpdatedAt(LocalDateTime.now());

        return vitalsRepository.save(v);
    }

    // List vitals by patient email
    public List<Vitals> listVitalsByPatientEmail(String patientEmail) {
        User user = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found for email: " + patientEmail));
        return vitalsRepository.findByPatientIdOrderByDateTimeDesc(user.getId());
    }

    // Create a daily shift nurse note
    public NurseNote createNurseNote(NurseNoteRequest request, String nurseId) {
        User user = userRepository.findByEmail(request.getPatientEmail())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found for email: " + request.getPatientEmail()));
        if (!user.isActive() || !user.hasRole(User.Role.PATIENT)) {
            throw new IllegalArgumentException("Provided email does not belong to an active patient");
        }

        NurseNote note = new NurseNote();
        note.setPatientId(user.getId());
        note.setNurseId(nurseId);
        note.setNote(request.getNote());
        note.setDate(request.getDate() != null ? request.getDate() : LocalDateTime.now());
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        return nurseNoteRepository.save(note);
    }

    // List nurse notes by patient email with optional date range
    public List<NurseNote> listNurseNotesByPatientEmail(String patientEmail, LocalDateTime from, LocalDateTime to) {
        User user = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found for email: " + patientEmail));
        if (from != null && to != null) {
            return nurseNoteRepository.findByPatientIdAndDateBetweenOrderByDateDesc(user.getId(), from, to);
        }
        return nurseNoteRepository.findByPatientIdOrderByDateDesc(user.getId());
    }

    // List patients from users collection (role = PATIENT)
    public List<NursePatientListItem> listPatientUsers(String query) {
        List<User> users = userRepository.findByRolesContains(User.Role.PATIENT);
        if (query != null && !query.isBlank()) {
            final String q = query.toLowerCase();
            users = users.stream()
                    .filter(u ->
                            (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(q)) ||
                            (u.getLastName() != null && u.getLastName().toLowerCase().contains(q)) ||
                            (u.getEmail() != null && u.getEmail().toLowerCase().contains(q)) ||
                            (u.getUsername() != null && u.getUsername().toLowerCase().contains(q)) ||
                            (u.getPhoneNumber() != null && u.getPhoneNumber().toLowerCase().contains(q))
                    )
                    .collect(Collectors.toList());
        }
        return users.stream()
                .filter(User::isActive)
                .map(NursePatientListItem::fromUser)
                .collect(Collectors.toList());
    }
    
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

        // Validate patient from users collection (patientId here is users.id)
        Optional<User> userOpt = userRepository.findById(request.getPatientId());
        if (userOpt.isEmpty() || !userOpt.get().isActive() || !userOpt.get().hasRole(User.Role.PATIENT)) {
            result.addError("Patient not found or inactive");
            return result;
        }

        // Resolve a valid prescription either by prescriptionId or by (patientId, medicationId)
        Optional<Prescription> prescription = resolveValidPrescription(
                request.getPatientId(), request.getMedicationId(), request.getPrescriptionId());

        if (prescription.isEmpty()) {
            result.addError("No valid prescription found for this medication");
            return result;
        }

        // Validate dosage
        if (request.getAdministeredDosage() == null || !request.getAdministeredDosage().equals(prescription.get().getDosage())) {
            result.addError("Administered dosage does not match prescribed dosage");
        }

        // Validate dosage unit
        if (request.getDosageUnit() == null || !request.getDosageUnit().equals(prescription.get().getDosageUnit())) {
            result.addError("Dosage unit does not match prescription");
        }

        // Check timing constraints (basic implementation) using user patientId
        List<AdministrationRecord> recentAdministrations = administrationRecordRepository
            .findRecentAdministrationsForPatientAndMedication(
                request.getPatientId(),
                (request.getMedicationId() != null ? request.getMedicationId() : prescription.get().getMedicationId()),
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
        
        // Resolve prescription again (consistent with validation)
        Prescription prescription = resolveValidPrescription(request.getPatientId(), request.getMedicationId(), request.getPrescriptionId())
            .orElseThrow(() -> new IllegalArgumentException("Valid prescription not found"));

        String medId = (request.getMedicationId() != null && !request.getMedicationId().isBlank() ? request.getMedicationId() : prescription.getMedicationId());
        Medication medication = medicationRepository.findById(medId)
            .orElseThrow(() -> new IllegalArgumentException("Medication not found"));
        
        // Create administration record
        AdministrationRecord record = new AdministrationRecord();
        record.setRecordId(UUID.randomUUID().toString());
        record.setPatientId(request.getPatientId());
        record.setNurseId(nurseId);
        record.setPrescriptionId(prescription.getPrescriptionId());
        record.setMedicationId(medId);
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
    
    // Mark medication as missed (does not decrement prescription quantity)
    public AdministrationRecordResponse markMedicationMissed(MedicationMissedRequest request, String nurseId) {
        // Verify patient exists (in users collection) by id and is active
        User user = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        if (!user.isActive() || !user.hasRole(User.Role.PATIENT)) {
            throw new IllegalArgumentException("Provided id does not belong to an active patient");
        }

        // Verify prescription exists and belongs to this patient & medication matches
        Prescription prescription = prescriptionRepository.findByPrescriptionId(request.getPrescriptionId())
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found"));
        String reqMedId = (request.getMedicationId() != null && !request.getMedicationId().isBlank() ? request.getMedicationId() : prescription.getMedicationId());
        if (!prescription.getPatientId().equals(request.getPatientId()) ||
            !prescription.getMedicationId().equals(reqMedId)) {
            throw new IllegalArgumentException("Prescription does not match patient/medication");
        }

        // Create administration record with FAILED status
        AdministrationRecord record = new AdministrationRecord();
        record.setRecordId(UUID.randomUUID().toString());
        record.setPatientId(request.getPatientId());
        record.setNurseId(nurseId);
        record.setPrescriptionId(request.getPrescriptionId());
        record.setMedicationId(request.getMedicationId());
        record.setMedicationName(prescription.getMedicationName());
        record.setAdministeredDosage(0.0);
        record.setDosageUnit(prescription.getDosageUnit());
        record.setAdministrationTime(LocalDateTime.now());
        record.setNotes(request.getNotes());
        record.setStatus(AdministrationRecord.AdministrationStatus.FAILED);

        AdministrationRecord saved = administrationRecordRepository.save(record);
        return AdministrationRecordResponse.fromAdministrationRecord(saved);
    }

    // Helper to find one valid prescription without triggering non-unique Optional errors
    private Optional<Prescription> resolveValidPrescription(String patientId, String medicationId, String prescriptionId) {
        if (prescriptionId != null && !prescriptionId.isBlank()) {
            return prescriptionRepository.findByPrescriptionId(prescriptionId)
                    .filter(p -> p.getPatientId().equals(patientId))
                    .filter(Prescription::isActive)
                    .filter(p -> p.getRemainingQuantity() == null || p.getRemainingQuantity() > 0);
        }

        // Fallback: list active by (patientId, medicationId) and choose one with remaining qty
        List<Prescription> candidates = prescriptionRepository
                .findActivePrescriptionsForPatientAndMedication(patientId, medicationId);
        return candidates.stream()
                .filter(p -> p.getRemainingQuantity() == null || p.getRemainingQuantity() > 0)
                // pick the most recently created/updated when available
                .sorted((a, b) -> {
                    var t1 = a.getUpdatedAt() != null ? a.getUpdatedAt() : a.getCreatedAt();
                    var t2 = b.getUpdatedAt() != null ? b.getUpdatedAt() : b.getCreatedAt();
                    return t2.compareTo(t1);
                })
                .findFirst();
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

