package com.hms.server.service.doctor;

import com.hms.server.dto.doctor.SurgeryDtos;
import com.hms.server.model.User;
import com.hms.server.models.doctor.Surgery;
import com.hms.server.repository.SurgeryRepository;
import com.hms.server.repository.UserRepository;
import com.hms.server.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurgeryService {

    private final SurgeryRepository surgeryRepository;
    private final UserRepository userRepository;

    public SurgeryDtos.ResponseItem create(SurgeryDtos.CreateRequest request) {
        String doctorId = getCurrentUserId();
        User patient = userRepository.findById(request.getPatientId())
                .filter(u -> u.getRoles() != null && u.getRoles().contains(User.Role.PATIENT))
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        Surgery surgery = new Surgery();
        surgery.setDoctorId(doctorId);
        surgery.setPatientId(patient.getId());
        surgery.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        surgery.setCondition(request.getCondition());
        surgery.setNotes(request.getNotes());
        surgery.setOperatingRoom(request.getOperatingRoom());
        surgery.setSurgeryType(request.getSurgeryType());
        surgery.setUrgency(request.getUrgency());
        surgery.setScheduledAt(request.getScheduledAt());
        surgery.setCreatedAt(LocalDateTime.now());
        surgery.setUpdatedAt(LocalDateTime.now());

        Surgery saved = surgeryRepository.save(surgery);
        return toResponse(saved);
    }

    public List<SurgeryDtos.ResponseItem> listForCurrentDoctor() {
        String doctorId = getCurrentUserId();
        return surgeryRepository.findByDoctorIdOrderByScheduledAtAsc(doctorId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public SurgeryDtos.ResponseItem markCompleted(String id) {
        String doctorId = getCurrentUserId();
        Surgery surgery = surgeryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Surgery not found"));
        if (!doctorId.equals(surgery.getDoctorId())) {
            throw new SecurityException("Not allowed");
        }
        surgery.setStatus(Surgery.Status.COMPLETED);
        surgery.setUpdatedAt(LocalDateTime.now());
        return toResponse(surgeryRepository.save(surgery));
    }

    public SurgeryDtos.CountsResponse getCountsForCurrentDoctor() {
        String doctorId = getCurrentUserId();
        long completed = surgeryRepository.countByDoctorIdAndStatus(doctorId, Surgery.Status.COMPLETED);
        long pending = surgeryRepository.countByDoctorIdAndStatus(doctorId, Surgery.Status.PENDING);
        SurgeryDtos.CountsResponse counts = new SurgeryDtos.CountsResponse();
        counts.setCompleted(completed);
        counts.setPending(pending);
        return counts;
    }

    public SurgeryDtos.ResponseItem update(SurgeryDtos.UpdateRequest request) {
        String doctorId = getCurrentUserId();
        Surgery surgery = surgeryRepository.findById(request.getId())
                .orElseThrow(() -> new IllegalArgumentException("Surgery not found"));
        if (!doctorId.equals(surgery.getDoctorId())) {
            throw new SecurityException("Not allowed");
        }

        if (StringUtils.hasText(request.getCondition())) {
            surgery.setCondition(request.getCondition());
        }
        if (request.getNotes() != null) {
            surgery.setNotes(request.getNotes());
        }
        if (request.getOperatingRoom() != null) {
            surgery.setOperatingRoom(request.getOperatingRoom());
        }
        if (request.getSurgeryType() != null) {
            surgery.setSurgeryType(request.getSurgeryType());
        }
        if (request.getUrgency() != null) {
            surgery.setUrgency(request.getUrgency());
        }
        if (request.getScheduledAt() != null) {
            surgery.setScheduledAt(request.getScheduledAt());
        }
        surgery.setUpdatedAt(LocalDateTime.now());

        return toResponse(surgeryRepository.save(surgery));
    }

    public void deleteById(String id) {
        String doctorId = getCurrentUserId();
        Surgery surgery = surgeryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Surgery not found"));
        if (!doctorId.equals(surgery.getDoctorId())) {
            throw new SecurityException("Not allowed");
        }
        surgeryRepository.deleteById(id);
    }

    public SurgeryDtos.ResponseItem getByIdForCurrentDoctor(String id) {
        String doctorId = getCurrentUserId();
        Surgery surgery = surgeryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Surgery not found"));
        if (!doctorId.equals(surgery.getDoctorId())) {
            throw new SecurityException("Not allowed");
        }
        return toResponse(surgery);
    }

    public List<SurgeryDtos.ResponseItem> searchPatientsByName(String query) {
        String q = Optional.ofNullable(query).orElse("").trim().toLowerCase();
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles() != null && u.getRoles().contains(User.Role.PATIENT))
                .filter(u -> (u.getFirstName() + " " + u.getLastName()).toLowerCase().contains(q))
                .limit(20)
                .map(u -> {
                    SurgeryDtos.ResponseItem item = new SurgeryDtos.ResponseItem();
                    item.setPatientId(u.getId());
                    item.setPatientName(u.getFirstName() + " " + u.getLastName());
                    return item;
                })
                .collect(Collectors.toList());
    }

    private String getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            return userPrincipal.getId();
        }
        throw new SecurityException("Unauthenticated");
    }

    private SurgeryDtos.ResponseItem toResponse(Surgery surgery) {
        SurgeryDtos.ResponseItem response = new SurgeryDtos.ResponseItem();
        response.setId(surgery.getId());
        response.setPatientId(surgery.getPatientId());
        response.setPatientName(surgery.getPatientName());
        response.setCondition(surgery.getCondition());
        response.setNotes(surgery.getNotes());
        response.setOperatingRoom(surgery.getOperatingRoom());
        response.setSurgeryType(surgery.getSurgeryType());
        response.setUrgency(surgery.getUrgency());
        response.setScheduledAt(surgery.getScheduledAt());
        response.setStatus(surgery.getStatus() != null ? surgery.getStatus().name() : null);
        response.setCreatedAt(surgery.getCreatedAt());
        response.setUpdatedAt(surgery.getUpdatedAt());
        return response;
    }
}


