package com.hms.server.repository;

import com.hms.server.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {
    
    Optional<Patient> findByPatientId(String patientId);
    
    Optional<Patient> findByUserId(String userId);
    
    Optional<Patient> findByEmail(String email);
    
    List<Patient> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    
    @Query("{'$or': [{'firstName': {'$regex': ?0, '$options': 'i'}}, {'lastName': {'$regex': ?0, '$options': 'i'}}, {'patientId': {'$regex': ?0, '$options': 'i'}}]}")
    List<Patient> findBySearchTerm(String searchTerm);
    
    List<Patient> findByIsActiveTrue();
    
    @Query("{'allergies': {'$in': [?0]}}")
    List<Patient> findByAllergiesContaining(String allergy);
    
    @Query("{'medicalConditions': {'$in': [?0]}}")
    List<Patient> findByMedicalConditionsContaining(String condition);
    
    long countByIsActiveTrue();
}
