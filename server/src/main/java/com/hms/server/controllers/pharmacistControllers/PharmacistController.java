package com.hms.server.controllers.pharmacistControllers;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.pharmacist.*;
import com.hms.server.models.pharmacistModels.Drug.DrugStatus;
import com.hms.server.models.pharmacistModels.Prescription.PrescriptionStatus;
import com.hms.server.service.pharmacist.DrugService;
import com.hms.server.service.pharmacist.PrescriptionService;
import com.hms.server.service.pharmacist.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST Controller for Pharmacist Dashboard operations
 * Follows Single Responsibility Principle - handles only HTTP requests/responses
 * Follows Dependency Inversion Principle - depends on service abstractions
 */
@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PharmacistController {
    
    private final DrugService drugService;
    private final PrescriptionService prescriptionService;
    private final ReportService reportService;
    
    // ============ DRUG INVENTORY ENDPOINTS ============
    
    /**
     * Get all drugs in inventory
     */
    @GetMapping("/inventory")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> getAllDrugs() {
        try {
            List<DrugResponse> drugs = drugService.getAllDrugs();
            return ResponseEntity.ok(new ApiResponse(true, "Drugs retrieved successfully", drugs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving drugs: " + e.getMessage(), null));
        }
    }
    
    /**
     * Get drug by ID
     */
    @GetMapping("/inventory/{id}")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> getDrugById(@PathVariable String id) {
        try {
            DrugResponse drug = drugService.getDrugById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Drug retrieved successfully", drug));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving drug: " + e.getMessage(), null));
        }
    }
    
    /**
     * Add new drug to inventory
     */
    @PostMapping("/inventory")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> addDrug(@Valid @RequestBody DrugRequest request) {
        try {
            DrugResponse drug = drugService.addDrug(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Drug added successfully", drug));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error adding drug: " + e.getMessage(), null));
        }
    }
    
    /**
     * Update existing drug
     */
    @PutMapping("/inventory/{id}")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> updateDrug(@PathVariable String id, @Valid @RequestBody DrugRequest request) {
        try {
            DrugResponse drug = drugService.updateDrug(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Drug updated successfully", drug));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating drug: " + e.getMessage(), null));
        }
    }
    
    /**
     * Delete drug from inventory
     */
    @DeleteMapping("/inventory/{id}")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> deleteDrug(@PathVariable String id) {
        try {
            drugService.deleteDrug(id);
            return ResponseEntity.ok(new ApiResponse(true, "Drug deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error deleting drug: " + e.getMessage(), null));
        }
    }
    
    /**
     * Get drugs by status
     */
    @GetMapping("/inventory/status/{status}")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> getDrugsByStatus(@PathVariable DrugStatus status) {
        try {
            List<DrugResponse> drugs = drugService.getDrugsByStatus(status);
            return ResponseEntity.ok(new ApiResponse(true, "Drugs retrieved successfully", drugs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving drugs: " + e.getMessage(), null));
        }
    }
    
    /**
     * Search drugs by name
     */
    @GetMapping("/inventory/search")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> searchDrugsByName(@RequestParam String name) {
        try {
            List<DrugResponse> drugs = drugService.searchDrugsByName(name);
            return ResponseEntity.ok(new ApiResponse(true, "Drugs retrieved successfully", drugs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error searching drugs: " + e.getMessage(), null));
        }
    }
    
    /**
     * Update drug quantity
     */
    @PatchMapping("/inventory/{id}/quantity")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> updateQuantity(@PathVariable String id, @RequestParam Integer quantity) {
        try {
            DrugResponse drug = drugService.updateQuantity(id, quantity);
            return ResponseEntity.ok(new ApiResponse(true, "Quantity updated successfully", drug));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating quantity: " + e.getMessage(), null));
        }
    }
    
    /**
     * Get low stock drugs
     */
    @GetMapping("/inventory/low-stock")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> getLowStockDrugs() {
        try {
            List<DrugResponse> drugs = drugService.getLowStockDrugs();
            return ResponseEntity.ok(new ApiResponse(true, "Low stock drugs retrieved successfully", drugs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving low stock drugs: " + e.getMessage(), null));
        }
    }
    
    // ============ PRESCRIPTION MANAGEMENT ENDPOINTS ============
    
    /**
     * Get all prescriptions
     */
    @GetMapping("/prescriptions")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> getAllPrescriptions() {
        try {
            List<PrescriptionResponse> prescriptions = prescriptionService.getAllPrescriptions();
            return ResponseEntity.ok(new ApiResponse(true, "Prescriptions retrieved successfully", prescriptions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving prescriptions: " + e.getMessage(), null));
        }
    }
    
    /**
     * Get prescription by ID
     */
    @GetMapping("/prescriptions/{id}")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> getPrescriptionById(@PathVariable String id) {
        try {
            PrescriptionResponse prescription = prescriptionService.getPrescriptionById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Prescription retrieved successfully", prescription));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving prescription: " + e.getMessage(), null));
        }
    }
    
    /**
     * Create new prescription
     */
    @PostMapping("/prescriptions")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse> createPrescription(@Valid @RequestBody PrescriptionRequest request) {
        try {
            PrescriptionResponse prescription = prescriptionService.createPrescription(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Prescription created successfully", prescription));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error creating prescription: " + e.getMessage(), null));
        }
    }
    
    /**
     * Update prescription
     */
    @PutMapping("/prescriptions/{id}")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> updatePrescription(@PathVariable String id, @Valid @RequestBody PrescriptionRequest request) {
        try {
            PrescriptionResponse prescription = prescriptionService.updatePrescription(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Prescription updated successfully", prescription));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating prescription: " + e.getMessage(), null));
        }
    }
    
    /**
     * Delete prescription
     */
    @DeleteMapping("/prescriptions/{id}")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse> deletePrescription(@PathVariable String id) {
        try {
            prescriptionService.deletePrescription(id);
            return ResponseEntity.ok(new ApiResponse(true, "Prescription deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error deleting prescription: " + e.getMessage(), null));
        }
    }
    
    /**
     * Get prescriptions by status
     */
    @GetMapping("/prescriptions/status/{status}")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> getPrescriptionsByStatus(@PathVariable PrescriptionStatus status) {
        try {
            List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByStatus(status);
            return ResponseEntity.ok(new ApiResponse(true, "Prescriptions retrieved successfully", prescriptions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving prescriptions: " + e.getMessage(), null));
        }
    }
    
    /**
     * Get prescriptions by patient ID
     */
    @GetMapping("/prescriptions/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse> getPrescriptionsByPatientId(@PathVariable String patientId) {
        try {
            List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByPatientId(patientId);
            return ResponseEntity.ok(new ApiResponse(true, "Prescriptions retrieved successfully", prescriptions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving prescriptions: " + e.getMessage(), null));
        }
    }
    
    /**
     * Dispense prescription
     */
    @PutMapping("/dispense/{id}")
    @PreAuthorize("hasAuthority('PHARMACIST')")
    public ResponseEntity<ApiResponse> dispensePrescription(@PathVariable String id, @Valid @RequestBody DispensePrescriptionRequest request) {
        try {
            PrescriptionResponse prescription = prescriptionService.dispensePrescription(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Prescription dispensed successfully", prescription));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error dispensing prescription: " + e.getMessage(), null));
        }
    }
    
    /**
     * Request substitution for prescription
     */
    @PostMapping("/request-substitution/{id}")
    @PreAuthorize("hasAuthority('PHARMACIST')")
    public ResponseEntity<ApiResponse> requestSubstitution(@PathVariable String id, @Valid @RequestBody SubstitutionRequest request) {
        try {
            PrescriptionResponse prescription = prescriptionService.requestSubstitution(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Substitution request logged successfully", prescription));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error requesting substitution: " + e.getMessage(), null));
        }
    }
    
    // ============ REPORT GENERATION ENDPOINTS ============
    
    /**
     * Get all reports
     */
    @GetMapping("/reports")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> getAllReports() {
        try {
            List<ReportResponse> reports = reportService.getAllReports();
            return ResponseEntity.ok(new ApiResponse(true, "Reports retrieved successfully", reports));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving reports: " + e.getMessage(), null));
        }
    }
    
    /**
     * Generate sales report
     */
    @PostMapping("/reports/sales")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> generateSalesReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam String generatedBy) {
        try {
            ReportResponse report = reportService.generateSalesReport(startDate, endDate, generatedBy);
            return ResponseEntity.ok(new ApiResponse(true, "Sales report generated successfully", report));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error generating sales report: " + e.getMessage(), null));
        }
    }
    
    /**
     * Generate stock distribution report
     */
    @PostMapping("/reports/stock-distribution")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> generateStockDistribution(@RequestParam String generatedBy) {
        try {
            ReportResponse report = reportService.generateStockDistribution(generatedBy);
            return ResponseEntity.ok(new ApiResponse(true, "Stock distribution report generated successfully", report));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error generating stock distribution report: " + e.getMessage(), null));
        }
    }
    
    /**
     * Generate inventory summary report
     */
    @PostMapping("/reports/inventory-summary")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> generateInventorySummary(@RequestParam String generatedBy) {
        try {
            ReportResponse report = reportService.generateInventorySummary(generatedBy);
            return ResponseEntity.ok(new ApiResponse(true, "Inventory summary report generated successfully", report));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error generating inventory summary report: " + e.getMessage(), null));
        }
    }
    
    /**
     * Generate low stock alert report
     */
    @PostMapping("/reports/low-stock-alert")
    @PreAuthorize("hasAnyAuthority('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ApiResponse> generateLowStockAlert(@RequestParam String generatedBy) {
        try {
            ReportResponse report = reportService.generateLowStockAlert(generatedBy);
            return ResponseEntity.ok(new ApiResponse(true, "Low stock alert report generated successfully", report));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error generating low stock alert report: " + e.getMessage(), null));
        }
    }
}
