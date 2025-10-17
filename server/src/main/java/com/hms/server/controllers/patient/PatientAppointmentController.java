package com.hms.server.controllers.patient;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.patient.AppointmentDtos;
import com.hms.server.service.patient.PatientAppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patient/appointments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class PatientAppointmentController {

    private final PatientAppointmentService patientAppointmentService;
    /**
     * Service layer for handling all patient related operations.
     */
    
    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse> listDoctors() {
        List<AppointmentDtos.DoctorOption> doctors = patientAppointmentService.listDoctors();
        return ResponseEntity.ok(new ApiResponse(true, "Doctors fetched", doctors));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> listMyAppointments() {
        List<AppointmentDtos.ResponseItem> appointments = patientAppointmentService.listMyAppointments();
        return ResponseEntity.ok(new ApiResponse(true, "Appointments fetched", appointments));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@Valid @RequestBody AppointmentDtos.CreateRequest request) {
        AppointmentDtos.ResponseItem created = patientAppointmentService.create(request);
        return ResponseEntity.ok(new ApiResponse(true, "Appointment created", created));
    }
}
