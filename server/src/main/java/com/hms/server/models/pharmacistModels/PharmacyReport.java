package com.hms.server.models.pharmacistModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "pharmacy_reports")
public class PharmacyReport {
    
    @Id
    private String id;
    
    @NotBlank(message = "Report type is required")
    private String reportType;
    
    @NotNull(message = "Report data is required")
    private Map<String, Object> data;
    
    private String generatedBy;
    
    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
    
    private String description;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public enum ReportType {
        MONTHLY_SALES,
        SALES_OVER_TIME,
        STOCK_DISTRIBUTION,
        INVENTORY_SUMMARY,
        DISPENSED_MEDICATIONS,
        LOW_STOCK_ALERT
    }
}
