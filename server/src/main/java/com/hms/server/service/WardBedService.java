package com.hms.server.service;

import com.hms.server.dto.AssignBedRequest;
import com.hms.server.dto.CreateBedRequest;
import com.hms.server.dto.UpdateBedStatusRequest;
import com.hms.server.model.User;
import com.hms.server.model.WardBed;
import com.hms.server.repository.UserRepository;
import com.hms.server.repository.WardBedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class WardBedService {

    @Autowired
    private WardBedRepository wardBedRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a bed
    public WardBed createBed(CreateBedRequest req) {
        wardBedRepository.findByWardNoAndBedNo(req.getWardNo(), req.getBedNo())
                .ifPresent(w -> { throw new IllegalArgumentException("Bed already exists in this ward"); });
        WardBed bed = new WardBed();
        bed.setWardNo(req.getWardNo());
        bed.setBedNo(req.getBedNo());
        bed.setStatus(WardBed.BedStatus.AVAILABLE);
        bed.setPatientId(null);
        return wardBedRepository.save(bed);
    }

    // List beds
    public List<WardBed> listBeds(String wardNo, WardBed.BedStatus status) {
        if (wardNo != null && status != null) return wardBedRepository.findByWardNoAndStatus(wardNo, status);
        if (wardNo != null) return wardBedRepository.findByWardNo(wardNo);
        if (status != null) return wardBedRepository.findByStatus(status);
        return wardBedRepository.findAll();
    }

    // Assign patient to a bed
    public WardBed assignBed(AssignBedRequest req) {
        WardBed bed = wardBedRepository.findByWardNoAndBedNo(req.getWardNo(), req.getBedNo())
                .orElseThrow(() -> new IllegalArgumentException("Bed not found"));
        if (bed.getStatus() == WardBed.BedStatus.OCCUPIED) {
            throw new IllegalArgumentException("Bed already occupied");
        }
        // Validate patient from users collection
        User u = userRepository.findById(req.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        if (!u.isActive() || !u.hasRole(User.Role.PATIENT)) {
            throw new IllegalArgumentException("Provided id does not belong to an active patient");
        }
        bed.setPatientId(req.getPatientId());
        bed.setStatus(WardBed.BedStatus.OCCUPIED);
        bed.setUpdatedAt(LocalDateTime.now());
        return wardBedRepository.save(bed);
    }

    // Release bed (discharge/transfer)
    public WardBed releaseBed(String wardNo, String bedNo) {
        WardBed bed = wardBedRepository.findByWardNoAndBedNo(wardNo, bedNo)
                .orElseThrow(() -> new IllegalArgumentException("Bed not found"));
        bed.setPatientId(null);
        bed.setStatus(WardBed.BedStatus.AVAILABLE);
        bed.setUpdatedAt(LocalDateTime.now());
        return wardBedRepository.save(bed);
    }

    // Update bed status
    public WardBed updateBedStatus(UpdateBedStatusRequest req) {
        WardBed bed = wardBedRepository.findByWardNoAndBedNo(req.getWardNo(), req.getBedNo())
                .orElseThrow(() -> new IllegalArgumentException("Bed not found"));
        bed.setStatus(req.getStatus());
        bed.setUpdatedAt(LocalDateTime.now());
        return wardBedRepository.save(bed);
    }

    // Delete bed
    public void deleteBed(String wardNo, String bedNo) {
        WardBed bed = wardBedRepository.findByWardNoAndBedNo(wardNo, bedNo)
                .orElseThrow(() -> new IllegalArgumentException("Bed not found"));
        wardBedRepository.delete(bed);
    }
}
