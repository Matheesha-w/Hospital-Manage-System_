package com.hms.server.service.patient;

import com.hms.server.dto.patient.AppointmentDtos;
import com.hms.server.model.User;
import com.hms.server.models.patientModels.Appointment;
import com.hms.server.repository.UserRepository;
import com.hms.server.repository.patient.AppointmentRepository;
import com.hms.server.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientAppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public List<AppointmentDtos.DoctorOption> listDoctors() {
        return userRepository.findByRolesContaining(User.Role.DOCTOR).stream()
                .filter(User::isActive)
                .filter(User::isApproved)
                .map(this::toDoctorOption)
                .collect(Collectors.toList());
    }

    public AppointmentDtos.ResponseItem create(AppointmentDtos.CreateRequest request) {
        String patientId = getCurrentUserId();
        User patient = userRepository.findById(patientId)
                .filter(User::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        User doctor = userRepository.findById(request.getDoctorId())
                .filter(user -> user.getRoles() != null && user.getRoles().contains(User.Role.DOCTOR))
                .filter(User::isActive)
                .filter(User::isApproved)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not available"));

        if (request.getAppointmentAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Appointment time must be in the future");
        }

        if (appointmentRepository.existsByDoctorIdAndAppointmentAt(doctor.getId(), request.getAppointmentAt())) {
            throw new IllegalArgumentException("Doctor already has an appointment at this time");
        }

        Appointment appointment = new Appointment();
        appointment.setPatientId(patient.getId());
        appointment.setDoctorId(doctor.getId());
        appointment.setPatientName(buildName(patient.getFirstName(), patient.getLastName()));
        appointment.setDoctorName(buildName(doctor.getFirstName(), doctor.getLastName()));
        appointment.setDoctorSpecialization(doctor.getSpecialization());
        appointment.setPatientEmail(patient.getEmail());
        appointment.setDoctorEmail(doctor.getEmail());
        appointment.setAppointmentAt(request.getAppointmentAt());
        appointment.setReason(request.getReason());
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());

        Appointment saved = appointmentRepository.save(appointment);
        return toResponse(saved);
    }

    public List<AppointmentDtos.ResponseItem> listMyAppointments() {
        String patientId = getCurrentUserId();
        return appointmentRepository.findByPatientIdOrderByAppointmentAtAsc(patientId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private AppointmentDtos.ResponseItem toResponse(Appointment appointment) {
        AppointmentDtos.ResponseItem response = new AppointmentDtos.ResponseItem();
        response.setId(appointment.getId());
        response.setDoctorId(appointment.getDoctorId());
        response.setDoctorName(appointment.getDoctorName());
        response.setDoctorSpecialization(appointment.getDoctorSpecialization());
        response.setDoctorEmail(appointment.getDoctorEmail());
        response.setAppointmentAt(appointment.getAppointmentAt());
        response.setReason(appointment.getReason());
        response.setStatus(appointment.getStatus() != null ? appointment.getStatus().name() : null);
        return response;
    }

    private AppointmentDtos.DoctorOption toDoctorOption(User user) {
        AppointmentDtos.DoctorOption option = new AppointmentDtos.DoctorOption();
        option.setId(user.getId());
        option.setName(buildName(user.getFirstName(), user.getLastName()));
        option.setSpecialization(user.getSpecialization());
        option.setEmail(user.getEmail());
        return option;
    }

    private String buildName(String first, String last) {
        String firstPart = Optional.ofNullable(first).map(String::trim).orElse("");
        String lastPart = Optional.ofNullable(last).map(String::trim).orElse("");
        return String.join(" ", firstPart, lastPart).trim();
    }

    private String getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            return userPrincipal.getId();
        }
        throw new SecurityException("Unauthenticated");
    }
}
