package com.hms.server.controllers.doctor;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.doctor.DoctorAppointmentDtos;
import com.hms.server.service.doctor.DoctorAppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/appointments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorAppointmentController {

    private final DoctorAppointmentService doctorAppointmentService;

    @GetMapping
    public ResponseEntity<ApiResponse> listMine() {
        List<DoctorAppointmentDtos.ResponseItem> data = doctorAppointmentService.listMyAppointments();
        return ResponseEntity.ok(new ApiResponse(true, "Appointments fetched", data));
    }
}
