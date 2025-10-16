package com.hms.server.repository.pharmacist;

import com.hms.server.models.pharmacistModels.PharmacyReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PharmacyReportRepository extends MongoRepository<PharmacyReport, String> {
    
    List<PharmacyReport> findByReportType(String reportType);
    
    List<PharmacyReport> findByGeneratedBy(String generatedBy);
    
    List<PharmacyReport> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
