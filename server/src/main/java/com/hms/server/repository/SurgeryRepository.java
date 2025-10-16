package com.hms.server.repository;

import com.hms.server.models.doctor.Surgery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SurgeryRepository extends MongoRepository<Surgery, String> {
    List<Surgery> findByDoctorIdOrderByScheduledAtAsc(String doctorId);
    List<Surgery> findByDoctorIdAndScheduledAtBetweenOrderByScheduledAtAsc(String doctorId, LocalDateTime start, LocalDateTime end);

    long countByDoctorIdAndStatus(String doctorId, Surgery.Status status);
}


