package com.hms.server.repository.pharmacist;

import com.hms.server.models.pharmacistModels.Drug;
import com.hms.server.models.pharmacistModels.Drug.DrugStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DrugRepository extends MongoRepository<Drug, String> {
    
    List<Drug> findByStatus(DrugStatus status);
    
    List<Drug> findByNameContainingIgnoreCase(String name);
    
    Optional<Drug> findByNameAndDosage(String name, String dosage);
    
    List<Drug> findByQuantityLessThanEqual(Integer quantity);
}
