package com.hms.server.repository.lab;

import com.hms.server.models.lab.LabReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabReportRepository extends MongoRepository<LabReport, String> {
    List<LabReport> findByStatus(String status);
    List<LabReport> findByPatientId(String patientId);
    List<LabReport> findByPatientNameContainingIgnoreCase(String patientName);
}


