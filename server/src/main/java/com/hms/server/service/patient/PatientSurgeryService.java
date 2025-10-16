package com.hms.server.service.patient;

import com.hms.server.dto.patient.PatientSurgeryDtos;
import com.hms.server.model.User;
import com.hms.server.models.doctor.Surgery;
import com.hms.server.repository.patient.PatientSurgeryRepository;
import com.hms.server.repository.UserRepository;
import com.hms.server.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientSurgeryService {

    private final PatientSurgeryRepository patientSurgeryRepository;
    private final UserRepository userRepository;

    public List<PatientSurgeryDtos.ResponseItem> listForCurrentPatient() {
        String patientId = getCurrentUserId();
        return patientSurgeryRepository.findByPatientIdOrderByScheduledAtAsc(patientId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PatientSurgeryDtos.ResponseItem> listCompletedForCurrentPatient() {
        String patientId = getCurrentUserId();
        return patientSurgeryRepository.findByPatientIdAndStatusOrderByScheduledAtAsc(patientId, Surgery.Status.COMPLETED)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private String getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            return userPrincipal.getId();
        }
        throw new SecurityException("Unauthenticated");
    }

    private PatientSurgeryDtos.ResponseItem toResponse(Surgery s) {
        PatientSurgeryDtos.ResponseItem r = new PatientSurgeryDtos.ResponseItem();
        r.setId(s.getId());
        r.setCondition(s.getCondition());
        r.setNotes(s.getNotes());
        r.setOperatingRoom(s.getOperatingRoom());
        r.setSurgeryType(s.getSurgeryType());
        r.setUrgency(s.getUrgency());
        r.setScheduledAt(s.getScheduledAt());
        r.setStatus(s.getStatus() != null ? s.getStatus().name() : null);
        r.setCompletedAt(s.getCompletedAt());

        Optional<User> doc = userRepository.findById(s.getDoctorId());
        doc.ifPresent(d -> {
            String name = String.join(" ",
                    Optional.ofNullable(d.getFirstName()).orElse(""),
                    Optional.ofNullable(d.getLastName()).orElse("")).trim();
            r.setDoctorName(name);
            r.setDoctorEmail(d.getEmail());
        });
        return r;
    }
}
