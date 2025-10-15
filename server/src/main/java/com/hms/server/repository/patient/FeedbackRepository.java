package com.hms.server.repository.patient;

import com.hms.server.models.patientModels.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    List<Feedback> findByPatientId(String patientId);
    List<Feedback> findByApprovedTrue();
    List<Feedback> findByApprovedFalse();
}
