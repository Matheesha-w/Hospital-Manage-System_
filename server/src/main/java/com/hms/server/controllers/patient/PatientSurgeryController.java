package com.hms.server.controllers.patient;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.patient.PatientSurgeryDtos;
import com.hms.server.service.patient.PatientSurgeryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patient/surgeries")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class PatientSurgeryController {

    private final PatientSurgeryService patientSurgeryService;

    @GetMapping
    public ResponseEntity<ApiResponse> listMine() {
        List<PatientSurgeryDtos.ResponseItem> list = patientSurgeryService.listForCurrentPatient();
        return ResponseEntity.ok(new ApiResponse(true, "Surgeries fetched", list));
    }

    @GetMapping("/completed")
    public ResponseEntity<ApiResponse> listCompleted() {
        List<PatientSurgeryDtos.ResponseItem> list = patientSurgeryService.listCompletedForCurrentPatient();
        return ResponseEntity.ok(new ApiResponse(true, "Completed surgeries fetched", list));
    }
}
