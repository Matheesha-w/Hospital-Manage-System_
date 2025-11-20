package com.hms.server.repository.lab;

import com.hms.server.models.lab.LabReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabReportRepository extends MongoRepository<LabReport, String> {
    // SRP: Repository handles only data access for LabReport entities
    List<LabReport> findByStatus(String status); // Query by report status

    List<LabReport> findByPatientId(String patientId); // Query by patient ID

    List<LabReport> findByPatientNameContainingIgnoreCase(String patientName); // Search by patient name

    // OCP: Adding new query methods won't affect existing methods or services using this repository
    // DIP: Services depend on this abstraction (interface) rather than concrete MongoRepository implementation
}
