package com.hms.server.repository;

import com.hms.server.model.Medication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicationRepository extends MongoRepository<Medication, String> {
    
    Optional<Medication> findByNameIgnoreCase(String name);
    
    @Query("{'name': {'$regex': ?0, '$options': 'i'}}")
    List<Medication> findByNameContainingIgnoreCase(String name);
    
    @Query("{'genericName': {'$regex': ?0, '$options': 'i'}}")
    List<Medication> findByGenericNameContainingIgnoreCase(String genericName);
    
    List<Medication> findByType(String type);
    
    List<Medication> findByIsActiveTrue();
    
    @Query("{'isControlledSubstance': true}")
    List<Medication> findControlledSubstances();
    
    @Query("{'$or': [{'name': {'$regex': ?0, '$options': 'i'}}, {'genericName': {'$regex': ?0, '$options': 'i'}}]}")
    List<Medication> findBySearchTerm(String searchTerm);
}

