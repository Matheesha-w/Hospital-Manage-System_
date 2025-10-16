package com.hms.server.repository.patient;

import com.hms.server.models.doctor.Surgery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientSurgeryRepository extends MongoRepository<Surgery, String> {
    List<Surgery> findByPatientIdOrderByScheduledAtAsc(String patientId);
    List<Surgery> findByPatientIdAndStatusOrderByScheduledAtAsc(String patientId, Surgery.Status status);
}
