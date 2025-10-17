package com.hms.server.models.adminModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "contact_messages")
public class ContactMessage {
    @Id
    private String id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private String patientId;
    private LocalDateTime createdAt = LocalDateTime.now();

    private boolean responded = false;
    private String adminResponse;
    private LocalDateTime respondedAt;
}


