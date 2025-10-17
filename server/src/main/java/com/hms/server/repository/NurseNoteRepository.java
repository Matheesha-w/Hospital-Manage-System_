package com.hms.server.repository;

import com.hms.server.model.NurseNote;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NurseNoteRepository extends MongoRepository<NurseNote, String> {
    List<NurseNote> findByPatientIdOrderByDateDesc(String patientId);
    List<NurseNote> findByPatientIdAndDateBetweenOrderByDateDesc(String patientId, LocalDateTime from, LocalDateTime to);
}
