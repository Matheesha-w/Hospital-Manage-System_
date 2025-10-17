package com.hms.server.repository;

import com.hms.server.models.adminModels.ContactMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ContactMessageRepository extends MongoRepository<ContactMessage, String> {
    List<ContactMessage> findByPatientIdOrderByCreatedAtDesc(String patientId);
}


