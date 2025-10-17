package com.hms.server.repository;

import com.hms.server.model.AdministrationRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdministrationRecordRepository extends MongoRepository<AdministrationRecord, String> {
    
    Optional<AdministrationRecord> findByRecordId(String recordId);
    
    List<AdministrationRecord> findByPatientId(String patientId);
    
    List<AdministrationRecord> findByNurseId(String nurseId);
    
    List<AdministrationRecord> findByPrescriptionId(String prescriptionId);
    
    @Query("{'patientId': ?0, 'administrationTime': {'$gte': ?1, '$lte': ?2}}")
    List<AdministrationRecord> findByPatientIdAndDateRange(String patientId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'nurseId': ?0, 'administrationTime': {'$gte': ?1, '$lte': ?2}}")
    List<AdministrationRecord> findByNurseIdAndDateRange(String nurseId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'status': 'COMPLETED', 'adverseReaction': {'$exists': true, '$ne': ''}}")
    List<AdministrationRecord> findRecordsWithAdverseReactions();
    
    @Query("{'patientId': ?0, 'medicationId': ?1, 'administrationTime': {'$gte': ?2}}")
    List<AdministrationRecord> findRecentAdministrationsForPatientAndMedication(String patientId, String medicationId, LocalDateTime since);
    
    @Query("{'status': 'PENDING'}")
    List<AdministrationRecord> findPendingAdministrations();
    
    @Query("{'nurseId': ?0, 'administrationTime': {'$gte': ?1, '$lte': ?2}}")
    List<AdministrationRecord> findByNurseIdAndAdministrationTimeBetween(String nurseId, LocalDateTime startTime, LocalDateTime endTime);
    
    @Query("{'nurseId': ?0, 'adverseReaction': {'$exists': true, '$ne': null}}")
    List<AdministrationRecord> findByNurseIdAndAdverseReactionIsNotNull(String nurseId);
}

