package com.hms.server.repository;

import com.hms.server.model.Vitals;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VitalsRepository extends MongoRepository<Vitals, String> {
    List<Vitals> findByPatientIdOrderByDateTimeDesc(String patientId);
}
