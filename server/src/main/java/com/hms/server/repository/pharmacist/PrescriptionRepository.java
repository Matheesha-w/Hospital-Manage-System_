package com.hms.server.repository.pharmacist;

import com.hms.server.models.pharmacistModels.Prescription;
import com.hms.server.models.pharmacistModels.Prescription.PrescriptionStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("pharmacistPrescriptionRepository")
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {
    
    List<Prescription> findByStatus(PrescriptionStatus status);
    
    List<Prescription> findByPatientId(String patientId);
    
    List<Prescription> findByDoctorId(String doctorId);
    
    List<Prescription> findByPharmacistId(String pharmacistId);
    
    List<Prescription> findByDrugId(String drugId);
    
    List<Prescription> findByPatientName(String patientName);
}
