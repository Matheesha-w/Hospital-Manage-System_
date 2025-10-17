package com.hms.server.service.doctor;

import com.hms.server.dto.doctor.SurgeryDtos;
import com.hms.server.model.User;
import com.hms.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorPatientLookupService {

    private final UserRepository userRepository;

    public List<SurgeryDtos.ResponseItem> searchPatientsByName(String query) {
        String q = Optional.ofNullable(query).orElse("").trim().toLowerCase();
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles() != null && u.getRoles().contains(User.Role.PATIENT))
                .filter(u -> (u.getFirstName() + " " + u.getLastName()).toLowerCase().contains(q))
                .limit(20)
                .map(u -> {
                    SurgeryDtos.ResponseItem item = new SurgeryDtos.ResponseItem();
                    item.setPatientId(u.getId());
                    item.setPatientName((Optional.ofNullable(u.getFirstName()).orElse("") + " " + Optional.ofNullable(u.getLastName()).orElse("")).trim());
                    return item;
                })
                .collect(Collectors.toList());
    }
}
