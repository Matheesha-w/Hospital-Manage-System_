package com.hms.server.service.lab;

import com.hms.server.dto.ApiResponse;
import com.hms.server.models.lab.LabReport;
import com.hms.server.model.Patient;
import com.hms.server.repository.lab.LabReportRepository;
import com.hms.server.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LabReportService {

    // DIP: Depends on abstractions (repositories) instead of concrete persistence logic
    private final LabReportRepository labReportRepository;
    private final PatientRepository patientRepository;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/server/uploads/lab-reports";

    // SRP: Handles only summary-related business logic
    public ApiResponse getSummary() {
        long patientCount = patientRepository.countByIsActiveTrue();
        long pending = labReportRepository.findByStatus("PENDING").size();
        long completed = labReportRepository.findByStatus("COMPLETED").size();
        return new ApiResponse(true, "Summary fetched", new java.util.HashMap<>() {{
            put("totalPatients", patientCount);
            put("pendingReports", pending);
            put("completedReports", completed);
        }});
    }

    // SRP: Handles lightweight patient list retrieval
    public ApiResponse listPatientsLite() {
        List<Patient> patients = patientRepository.findByIsActiveTrue();
        List<Map<String, String>> lite = patients.stream().map(p -> {
            Map<String, String> m = new HashMap<>();
            m.put("patientId", p.getPatientId());
            m.put("name", p.getFullName());
            return m;
        }).collect(Collectors.toList());
        return new ApiResponse(true, "Patients fetched", lite);
    }

    // SRP: Handles fetching all lab reports
    public ApiResponse listAll() {
        List<LabReport> reports = labReportRepository.findAll();
        return new ApiResponse(true, "Reports fetched", reports);
    }

    // SRP: Handles filtering lab reports by status
    public ApiResponse listByStatus(String status) {
        List<LabReport> reports = labReportRepository.findByStatus(status);
        return new ApiResponse(true, "Reports fetched", reports);
    }

    // SRP: Handles searching lab reports by patient name
    public ApiResponse search(String keyword) {
        List<LabReport> reportsByName = labReportRepository.findByPatientNameContainingIgnoreCase(keyword);
        return new ApiResponse(true, "Search results", reportsByName);
    }

    // SRP: Fetches report by id
    public ApiResponse getById(String id) {
        Optional<LabReport> report = labReportRepository.findById(id);
        return report
                .map(r -> new ApiResponse(true, "Report fetched", r))
                .orElseGet(() -> new ApiResponse(false, "Report not found"));
    }

    // SRP & OCP: Updates status of a report; can handle new statuses without changing method
    public ApiResponse updateStatus(String id, String status) {
        Optional<LabReport> reportOpt = labReportRepository.findById(id);
        if (reportOpt.isEmpty()) return new ApiResponse(false, "Report not found");
        LabReport report = reportOpt.get();
        report.setStatus(status);
        report.setUploadDate(LocalDateTime.now());
        labReportRepository.save(report);
        return new ApiResponse(true, "Status updated", report);
    }

    // SRP: Handles file upload and report creation logic
    // OCP: Can extend to support new file types or storage locations without changing method signature
    public ApiResponse upload(String patientId,
                              String patientName,
                              String testName,
                              String description,
                              String uploadedBy,
                              MultipartFile file) {
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            LabReport report = new LabReport();
            report.setPatientId(patientId);
            report.setPatientName(patientName);
            report.setTestName(testName);
            report.setDescription(description);
            report.setStatus("PENDING");
            report.setUploadedBy(uploadedBy);
            report.setUploadDate(LocalDateTime.now());

            if (file != null && !file.isEmpty()) {
                String safeFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path dest = Paths.get(UPLOAD_DIR, safeFileName);
                Files.write(dest, file.getBytes());
                report.setFileName(file.getOriginalFilename());
                report.setFileUrl("/api/lab/reports/files/" + safeFileName);
            }

            report.prePersist(); // SRP: ensures entity consistency before saving
            LabReport saved = labReportRepository.save(report);
            return new ApiResponse(true, "Report uploaded", saved);
        } catch (IOException e) {
            return new ApiResponse(false, "File upload failed: " + e.getMessage());
        }
    }
}
