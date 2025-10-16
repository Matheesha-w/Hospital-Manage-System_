package com.hms.server.service.pharmacist;

import com.hms.server.dto.pharmacist.ReportResponse;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface for Pharmacy Report generation
 * Follows Interface Segregation Principle - contains only report-related operations
 * Follows Open/Closed Principle - can be extended with new report types without modification
 */
public interface ReportService {
    
    /**
     * Generate sales report
     */
    ReportResponse generateSalesReport(LocalDateTime startDate, LocalDateTime endDate, String generatedBy);
    
    /**
     * Generate stock distribution report
     */
    ReportResponse generateStockDistribution(String generatedBy);
    
    /**
     * Generate inventory summary report
     */
    ReportResponse generateInventorySummary(String generatedBy);
    
    /**
     * Generate dispensed medications report
     */
    ReportResponse generateDispensedMedicationsReport(LocalDateTime startDate, LocalDateTime endDate, String generatedBy);
    
    /**
     * Generate low stock alert report
     */
    ReportResponse generateLowStockAlert(String generatedBy);
    
    /**
     * Get all reports
     */
    List<ReportResponse> getAllReports();
    
    /**
     * Get report by ID
     */
    ReportResponse getReportById(String id);
    
    /**
     * Get reports by type
     */
    List<ReportResponse> getReportsByType(String reportType);
}
