package com.hms.server.repository.patient;

import com.hms.server.models.patientModels.Feedback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    Logger LOG = LoggerFactory.getLogger(FeedbackRepository.class);

    List<Feedback> findByPatientId(String patientId);
    List<Feedback> findByApprovedTrue();
    List<Feedback> findByApprovedFalse();

    default List<Feedback> safeFindPatientFeedback(String patientId) {
        try {
            // Returns empty list if MongoDB connection fails
            return findByPatientId(patientId);
        } catch (Exception ex) {
            LOG.error("Failed to load feedback for patient {}", patientId, ex);
            return Collections.emptyList();
        }
    }

    default List<Feedback> safeFindPendingFeedback() {
        try {
            // Returns empty list if MongoDB connection fails
            return findByApprovedFalse();
        } catch (Exception ex) {
            LOG.error("Could not pull pending feedback", ex);
            return Collections.emptyList();
        }
    }
}
