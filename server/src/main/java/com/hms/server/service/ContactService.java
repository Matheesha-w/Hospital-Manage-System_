package com.hms.server.service;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.ContactMessageRequest;
import com.hms.server.dto.ContactResponseRequest;
import com.hms.server.models.adminModels.ContactMessage;
import com.hms.server.model.User;
import com.hms.server.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactMessageRepository repository;
    private final AuthService authService;

    public ApiResponse createMessage(ContactMessageRequest req) {
        ContactMessage msg = new ContactMessage();
        msg.setName(req.getName());
        msg.setEmail(req.getEmail());
        msg.setSubject(req.getSubject());
        msg.setMessage(req.getMessage());
        User current = authService.getCurrentUserEntity();
        if (current != null && current.getRoles().contains(User.Role.PATIENT)) {
            msg.setPatientId(current.getId());
        }
        ContactMessage saved = repository.save(msg);
        return new ApiResponse(true, "Message received", saved);
    }

    public ApiResponse listMessages() {
        List<ContactMessage> messages = repository.findAll();
        return new ApiResponse(true, "Messages retrieved", messages);
    }

    public ApiResponse respond(String id, ContactResponseRequest req) {
        ContactMessage msg = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Message not found"));
        msg.setResponded(true);
        msg.setAdminResponse(req.getResponse());
        msg.setRespondedAt(LocalDateTime.now());
        repository.save(msg);
        // Email sending would go here
        return new ApiResponse(true, "Response recorded");
    }

    public ApiResponse listMessagesForCurrentPatient() {
        User current = authService.getCurrentUserEntity();
        if (current == null || !current.getRoles().contains(User.Role.PATIENT)) {
            return new ApiResponse(false, "Not authorized to view messages");
        }
        List<ContactMessage> messages = repository.findByPatientIdOrderByCreatedAtDesc(current.getId());
        return new ApiResponse(true, "Messages retrieved", messages);
    }
}


