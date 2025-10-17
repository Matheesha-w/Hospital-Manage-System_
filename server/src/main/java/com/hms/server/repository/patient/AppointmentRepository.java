package com.hms.server.repository.patient;

import com.hms.server.models.patientModels.Appointment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    Logger LOG = LoggerFactory.getLogger(AppointmentRepository.class);

    List<Appointment> findByPatientIdOrderByAppointmentAtAsc(String patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentAtAsc(String doctorId);
    List<Appointment> findByDoctorIdAndAppointmentAtBetween(String doctorId, LocalDateTime start, LocalDateTime end);
    boolean existsByDoctorIdAndAppointmentAt(String doctorId, LocalDateTime appointmentAt);

    default List<Appointment> safeFindPatientAppointments(String patientId) {
        try {
            // Helps us avoid blank screens when patient schedules misbehave
            return findByPatientIdOrderByAppointmentAtAsc(patientId);
        } catch (Exception ex) {
            LOG.error("Unable to fetch appointments for patient {}", patientId, ex);
            return Collections.emptyList();
        }
    }

    default boolean safeDoctorSlotExists(String doctorId, LocalDateTime appointmentAt) {
        try {
            return existsByDoctorIdAndAppointmentAt(doctorId, appointmentAt);
        } catch (Exception ex) {
            LOG.error("Slot lookup failed for doctor {} at {}", doctorId, appointmentAt, ex);
            return false;
        }
    }
}
