package com.hms.server.controllers.doctor;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.doctor.SurgeryDtos;
import com.hms.server.service.doctor.SurgeryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/surgeries")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorSurgeryController {

    private final SurgeryService surgeryService;

    @PostMapping
    public ResponseEntity<ApiResponse> create(@Valid @RequestBody SurgeryDtos.CreateRequest request) {
        var created = surgeryService.create(request);
        return ResponseEntity.ok(new ApiResponse(true, "Surgery scheduled", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> listMine() {
        List<SurgeryDtos.ResponseItem> list = surgeryService.listForCurrentDoctor();
        return ResponseEntity.ok(new ApiResponse(true, "Surgeries fetched", list));
    }

    @GetMapping("/counts")
    public ResponseEntity<ApiResponse> getCounts() {
        var counts = surgeryService.getCountsForCurrentDoctor();
        return ResponseEntity.ok(new ApiResponse(true, "Counts fetched", counts));
    }

    @GetMapping("/completed")
    public ResponseEntity<ApiResponse> getCompletedSurgeries() {
        List<SurgeryDtos.ResponseItem> completedSurgeries = surgeryService.getCompletedSurgeriesForCurrentDoctor();
        return ResponseEntity.ok(new ApiResponse(true, "Completed surgeries fetched", completedSurgeries));
    }

    @PutMapping
    public ResponseEntity<ApiResponse> update(@Valid @RequestBody SurgeryDtos.UpdateRequest request) {
        var updated = surgeryService.update(request);
        return ResponseEntity.ok(new ApiResponse(true, "Surgery updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable String id) {
        surgeryService.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Surgery deleted"));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse> markComplete(@PathVariable String id) {
        var updated = surgeryService.markCompleted(id);
        return ResponseEntity.ok(new ApiResponse(true, "Surgery marked as completed", updated));
    }

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse> searchPatients(@RequestParam(name = "q", required = false) String q) {
        var results = surgeryService.searchPatientsByName(q);
        return ResponseEntity.ok(new ApiResponse(true, "Patients fetched", results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getOne(@PathVariable String id) {
        var item = surgeryService.getByIdForCurrentDoctor(id);
        return ResponseEntity.ok(new ApiResponse(true, "Surgery fetched", item));
    }
}


