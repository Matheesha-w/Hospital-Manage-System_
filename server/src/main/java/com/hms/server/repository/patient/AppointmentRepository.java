package com.hms.server.repository.patient;

import com.hms.server.models.patientModels.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByPatientIdOrderByAppointmentAtAsc(String patientId);
    List<Appointment> findByDoctorIdAndAppointmentAtBetween(String doctorId, LocalDateTime start, LocalDateTime end);
    boolean existsByDoctorIdAndAppointmentAt(String doctorId, LocalDateTime appointmentAt);
}
