package com.hms.server.repository.patient;

import com.hms.server.models.doctor.Surgery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

@Repository
public interface PatientSurgeryRepository extends MongoRepository<Surgery, String> {
    Logger LOG = LoggerFactory.getLogger(PatientSurgeryRepository.class);

    List<Surgery> findByPatientIdOrderByScheduledAtAsc(String patientId);
    List<Surgery> findByPatientIdAndStatusOrderByScheduledAtAsc(String patientId, Surgery.Status status);

    default List<Surgery> safeFindUpcomingSurgeries(String patientId) {
        try {
            // Makes sure upcoming surgeries still show up if MongoDB didn't connect well
            return findByPatientIdOrderByScheduledAtAsc(patientId);
        } catch (Exception ex) {
            // Returns empty list if MongoDB connection fails
            LOG.error("Unable to list surgeries for patient {}", patientId, ex);
            return Collections.emptyList();
        }
    }

    default List<Surgery> safeFindSurgeriesByStatus(String patientId, Surgery.Status status) {
        try {
            return findByPatientIdAndStatusOrderByScheduledAtAsc(patientId, status);
        } catch (Exception ex) {
            // If Surgery lookup fails, returns empty list
            LOG.error("Surgery lookup failed for patient {} with status {}", patientId, status, ex);
            return Collections.emptyList();
        }
    }
}
