package com.hms.server.controllers.nurseControllers;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.*;
import com.hms.server.service.NurseService;
import com.hms.server.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nurse")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowedHeaders = "*",
    methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS },
    allowCredentials = "true"
)
public class NurseController {
    
    @Autowired
    private NurseService nurseService;
    
    // Search patients
    @PostMapping("/patients/search")
    public ResponseEntity<ApiResponse> searchPatients(
            @Valid @RequestBody PatientSearchRequest request) {
        try {
            List<PatientResponse> patients = nurseService.searchPatients(request);
            return ResponseEntity.ok(new ApiResponse(true, "Patients retrieved successfully", patients));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Failed to search patients: " + e.getMessage()));
        }
    }

    // List patients from users collection (role = PATIENT)
    @GetMapping("/patients/users")
    public ResponseEntity<ApiResponse> listPatientUsers(@RequestParam(value = "q", required = false) String q) {
        try {
            List<NursePatientListItem> patients = nurseService.listPatientUsers(q);
            return ResponseEntity.ok(new ApiResponse(true, "Patients (users) retrieved successfully", patients));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Failed to list patient users: " + e.getMessage()));
        }
    }

    // Create prescription by patient email (nurse)
    @PostMapping("/prescriptions")
    public ResponseEntity<ApiResponse> createPrescription(
            @Valid @RequestBody NurseCreatePrescriptionRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            String nurseId = userPrincipal.getId();
            PrescriptionResponse created = nurseService.createPrescriptionByPatientEmail(request, nurseId);
            return ResponseEntity.ok(new ApiResponse(true, "Prescription created", created));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to create prescription: " + e.getMessage()));
        }
    }

    // List prescriptions by patient email
    @GetMapping("/prescriptions")
    public ResponseEntity<ApiResponse> listPrescriptionsByEmail(@RequestParam("patientEmail") String patientEmail) {
        try {
            List<PrescriptionResponse> list = nurseService.listPrescriptionsByPatientEmail(patientEmail);
            return ResponseEntity.ok(new ApiResponse(true, "Prescriptions retrieved", list));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to fetch prescriptions: " + e.getMessage()));
        }
    }
    
    // Get patient by ID
    @GetMapping("/patients/{patientId}")
    public ResponseEntity<ApiResponse> getPatient(@PathVariable String patientId) {
        try {
            return nurseService.getPatientById(patientId)
                .map(patient -> ResponseEntity.ok(new ApiResponse(true, "Patient retrieved successfully", patient)))
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Failed to get patient: " + e.getMessage()));
        }
    }
    
    // Get active prescriptions for a patient
    @GetMapping("/patients/{patientId}/prescriptions")
    public ResponseEntity<ApiResponse> getActivePrescriptions(
            @PathVariable String patientId) {
        try {
            List<PrescriptionResponse> prescriptions = nurseService.getActivePrescriptions(patientId);
            return ResponseEntity.ok(new ApiResponse(true, "Prescriptions retrieved successfully", prescriptions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Failed to get prescriptions: " + e.getMessage()));
        }
    }
    
    // Validate medication administration
    @PostMapping("/medications/validate")
    public ResponseEntity<ApiResponse> validateMedicationAdministration(
            @Valid @RequestBody MedicationAdministrationRequest request) {
        try {
            NurseService.ValidationResult result = nurseService.validateMedicationAdministration(request);
            return ResponseEntity.ok(new ApiResponse(true, "Validation completed", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Validation failed: " + e.getMessage()));
        }
    }
    
    // Administer medication
    @PostMapping("/medications/administer")
    public ResponseEntity<ApiResponse> administerMedication(
            @Valid @RequestBody MedicationAdministrationRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            String nurseId = userPrincipal.getId();
            AdministrationRecordResponse record = nurseService.administerMedication(request, nurseId);
            return ResponseEntity.ok(new ApiResponse(true, "Medication administered successfully", record));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Failed to administer medication: " + e.getMessage()));
        }
    }
    
    // Get administration history for a patient
    @GetMapping("/patients/{patientId}/administration-history")
    public ResponseEntity<ApiResponse> getPatientAdministrationHistory(
            @PathVariable String patientId) {
        try {
            List<AdministrationRecordResponse> history = nurseService.getAdministrationHistory(patientId);
            return ResponseEntity.ok(new ApiResponse(true, "Administration history retrieved successfully", history));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Failed to get administration history: " + e.getMessage()));
        }
    }
    
    // Get nurse's administration history
    @GetMapping("/administration-history")
    public ResponseEntity<ApiResponse> getNurseAdministrationHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            String nurseId = userPrincipal.getId();
            List<AdministrationRecordResponse> history = nurseService.getNurseAdministrationHistory(nurseId);
            return ResponseEntity.ok(new ApiResponse(true, "Administration history retrieved successfully", history));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Failed to get administration history: " + e.getMessage()));
        }
    }
    
    // Get nurse dashboard statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse> getDashboardStats(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            String nurseId = userPrincipal.getId();
            Map<String, Object> stats = nurseService.getDashboardStats(nurseId);
            return ResponseEntity.ok(new ApiResponse(true, "Dashboard statistics retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Failed to get dashboard statistics: " + e.getMessage()));
        }
    }
    
    // Report adverse reaction
    @PostMapping("/administration/{recordId}/adverse-reaction")
    public ResponseEntity<ApiResponse> reportAdverseReaction(
            @PathVariable String recordId,
            @RequestBody String adverseReaction) {
        try {
            AdministrationRecordResponse record = nurseService.reportAdverseReaction(recordId, adverseReaction);
            return ResponseEntity.ok(new ApiResponse(true, "Adverse reaction reported successfully", record));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Failed to report adverse reaction: " + e.getMessage()));
        }
    }
}
