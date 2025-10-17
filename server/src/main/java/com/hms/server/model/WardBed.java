package com.hms.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Document(collection = "ward_beds")
@CompoundIndexes({
        @CompoundIndex(name = "ward_bed_unique", def = "{ 'wardNo': 1, 'bedNo': 1 }", unique = true)
})
public class WardBed {
    @Id
    private String id;

    @NotBlank
    private String wardNo; // e.g., A, B, ICU-1

    @NotBlank
    private String bedNo; // e.g., 1, 2, 3

    private BedStatus status = BedStatus.AVAILABLE;

    // Link to users collection id (patient user id)
    private String patientId; // null if available

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum BedStatus { AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getWardNo() { return wardNo; }
    public void setWardNo(String wardNo) { this.wardNo = wardNo; }

    public String getBedNo() { return bedNo; }
    public void setBedNo(String bedNo) { this.bedNo = bedNo; }

    public BedStatus getStatus() { return status; }
    public void setStatus(BedStatus status) { this.status = status; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
