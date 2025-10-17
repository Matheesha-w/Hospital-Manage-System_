package com.hms.server.models.lab;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "lab_reports")
public class LabReport {

    @Id
    private String id;

    private String patientId;
    private String patientName;
    private String testName;
    private String description;
    private String status; // PENDING, COMPLETED
    private String fileUrl; // downloadable endpoint
    private String fileName;
    private LocalDateTime uploadDate;
    private String uploadedBy; // Lab technician user id

    public void prePersist() {
        if (uploadDate == null) {
            uploadDate = LocalDateTime.now();
        }
        if (status == null || status.isBlank()) {
            status = "PENDING";
        }
    }
}



