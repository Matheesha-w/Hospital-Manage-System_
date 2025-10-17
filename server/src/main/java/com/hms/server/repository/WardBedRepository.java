package com.hms.server.repository;

import com.hms.server.model.WardBed;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WardBedRepository extends MongoRepository<WardBed, String> {
    Optional<WardBed> findByWardNoAndBedNo(String wardNo, String bedNo);
    List<WardBed> findByWardNo(String wardNo);
    List<WardBed> findByStatus(WardBed.BedStatus status);
    List<WardBed> findByWardNoAndStatus(String wardNo, WardBed.BedStatus status);
    List<WardBed> findByPatientId(String patientId);
}
