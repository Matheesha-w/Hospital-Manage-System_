package com.hms.server.service.doctor;

import com.hms.server.dto.doctor.DoctorAppointmentDtos;
import com.hms.server.models.patientModels.Appointment;
import com.hms.server.repository.patient.AppointmentRepository;
import com.hms.server.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorAppointmentService {

    private final AppointmentRepository appointmentRepository;

    public List<DoctorAppointmentDtos.ResponseItem> listMyAppointments() {
        String doctorId = getCurrentDoctorId();
        return appointmentRepository.findByDoctorIdOrderByAppointmentAtAsc(doctorId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private DoctorAppointmentDtos.ResponseItem toResponse(Appointment a) {
        DoctorAppointmentDtos.ResponseItem r = new DoctorAppointmentDtos.ResponseItem();
        r.setId(a.getId());
        r.setPatientId(a.getPatientId());
        r.setPatientName(a.getPatientName());
        r.setPatientEmail(a.getPatientEmail());
        r.setAppointmentAt(a.getAppointmentAt());
        r.setReason(a.getReason());
        r.setStatus(a.getStatus() != null ? a.getStatus().name() : null);
        r.setDoctorId(a.getDoctorId());
        r.setDoctorName(a.getDoctorName());
        r.setDoctorEmail(a.getDoctorEmail());
        r.setDoctorSpecialization(a.getDoctorSpecialization());
        return r;
    }

    private String getCurrentDoctorId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal up) {
            return up.getId();
        }
        throw new SecurityException("Unauthenticated");
    }
}
