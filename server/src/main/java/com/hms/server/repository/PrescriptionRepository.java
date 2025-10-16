package com.hms.server.repository;

import com.hms.server.model.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {
    
    Optional<Prescription> findByPrescriptionId(String prescriptionId);
    
    List<Prescription> findByPatientId(String patientId);
    
    List<Prescription> findByPatientIdAndStatus(String patientId, Prescription.PrescriptionStatus status);
    
    @Query("{'patientId': ?0, 'status': 'ACTIVE', 'endDate': {'$gt': ?1}}")
    List<Prescription> findActivePrescriptionsForPatient(String patientId, LocalDateTime currentTime);
    
    @Query("{'patientId': ?0, 'medicationId': ?1, 'status': 'ACTIVE'}")
    List<Prescription> findActivePrescriptionsForPatientAndMedication(String patientId, String medicationId);
    
    List<Prescription> findByDoctorId(String doctorId);
    
    List<Prescription> findByMedicationId(String medicationId);
    
    @Query("{'status': 'ACTIVE', 'remainingQuantity': {'$gt': 0}}")
    List<Prescription> findActivePrescriptionsWithRemainingQuantity();
    
    @Query("{'patientId': ?0, 'medicationId': ?1, 'status': 'ACTIVE', 'remainingQuantity': {'$gt': 0}}")
    Optional<Prescription> findValidPrescriptionForAdministration(String patientId, String medicationId);
    
    @Query("{'status': 'ACTIVE', 'startDate': {'$lte': ?1}, 'endDate': {'$gte': ?0}}")
    List<Prescription> findActivePrescriptionsForToday(LocalDateTime startOfDay, LocalDateTime endOfDay);
}

