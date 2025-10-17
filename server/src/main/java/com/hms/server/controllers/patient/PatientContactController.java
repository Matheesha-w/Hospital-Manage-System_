package com.hms.server.controllers.patient;

import com.hms.server.dto.ApiResponse;
import com.hms.server.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patient/contacts")
@PreAuthorize("hasRole('PATIENT')")
@RequiredArgsConstructor
public class PatientContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<ApiResponse> listMyMessages() {
        return ResponseEntity.ok(contactService.listMessagesForCurrentPatient());
    }
}
