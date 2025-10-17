package com.hms.server.controllers.lab;

import com.hms.server.dto.ApiResponse;
import com.hms.server.security.UserPrincipal;
import com.hms.server.service.lab.LabReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/api/lab/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LabReportController {

    private final LabReportService labReportService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','ADMIN')")
    public ResponseEntity<ApiResponse> summary() {
        return ResponseEntity.ok(labReportService.getSummary());
    }

    @GetMapping("/patients")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','ADMIN')")
    public ResponseEntity<ApiResponse> patients() {
        return ResponseEntity.ok(labReportService.listPatientsLite());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','ADMIN','DOCTOR','NURSE')")
    public ResponseEntity<ApiResponse> listAll() {
        return ResponseEntity.ok(labReportService.listAll());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','ADMIN')")
    public ResponseEntity<ApiResponse> listByStatus(@PathVariable String status) {
        return ResponseEntity.ok(labReportService.listByStatus(status));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','ADMIN','DOCTOR','NURSE')")
    public ResponseEntity<ApiResponse> search(@RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(labReportService.search(keyword));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','ADMIN','DOCTOR','NURSE')")
    public ResponseEntity<ApiResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(labReportService.getById(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','ADMIN')")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(labReportService.updateStatus(id, status));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','ADMIN')")
    public ResponseEntity<ApiResponse> upload(@RequestParam String patientId,
                                              @RequestParam String patientName,
                                              @RequestParam String testName,
                                              @RequestParam String description,
                                              @RequestPart(value = "file", required = false) MultipartFile file,
                                              @AuthenticationPrincipal UserPrincipal principal) {
        String uploadedBy = principal != null ? principal.getId() : null;
        ApiResponse response = labReportService.upload(patientId, patientName, testName, description, uploadedBy, file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/files/{file}")
    @PreAuthorize("hasAnyAuthority('LAB_TECHNICIAN','ADMIN','DOCTOR','NURSE')")
    public ResponseEntity<FileSystemResource> download(@PathVariable("file") String fileName) {
        File file = new File(System.getProperty("user.dir") + "/server/uploads/lab-reports/" + fileName);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        FileSystemResource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}


