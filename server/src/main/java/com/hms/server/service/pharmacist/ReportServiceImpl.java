package com.hms.server.service.pharmacist;

import com.hms.server.dto.pharmacist.ReportResponse;
import com.hms.server.models.pharmacistModels.Drug;
import com.hms.server.models.pharmacistModels.Drug.DrugStatus;
import com.hms.server.models.pharmacistModels.PharmacyReport;
import com.hms.server.models.pharmacistModels.Prescription;
import com.hms.server.models.pharmacistModels.Prescription.PrescriptionStatus;
import com.hms.server.repository.pharmacist.DrugRepository;
import com.hms.server.repository.pharmacist.PharmacyReportRepository;
import com.hms.server.repository.pharmacist.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of ReportService
 * Follows Single Responsibility Principle - handles only report generation logic
 * Follows Open/Closed Principle - new report types can be added by extending this class
 */
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    
    private final PharmacyReportRepository reportRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final DrugRepository drugRepository;
    
    @Override
    public ReportResponse generateSalesReport(LocalDateTime startDate, LocalDateTime endDate, String generatedBy) {
        List<Prescription> dispensedPrescriptions = prescriptionRepository.findByStatus(PrescriptionStatus.DISPENSED);
        
        // Filter by date range if provided
        if (startDate != null && endDate != null) {
            dispensedPrescriptions = dispensedPrescriptions.stream()
                    .filter(p -> p.getDispensedAt() != null && 
                            p.getDispensedAt().isAfter(startDate) && 
                            p.getDispensedAt().isBefore(endDate))
                    .collect(Collectors.toList());
        }
        
        // Calculate sales data
        Map<String, Object> data = new HashMap<>();
        data.put("totalPrescriptionsDispensed", dispensedPrescriptions.size());
        data.put("totalRevenue", calculateRevenue(dispensedPrescriptions));
        data.put("medicationsSold", getMedicationsSoldCount(dispensedPrescriptions));
        data.put("topSellingDrugs", getTopSellingDrugs(dispensedPrescriptions, 5));
        
        PharmacyReport report = new PharmacyReport();
        report.setReportType("MONTHLY_SALES");
        report.setData(data);
        report.setGeneratedBy(generatedBy);
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setDescription("Monthly sales report showing revenue and prescriptions dispensed");
        report.setCreatedAt(LocalDateTime.now());
        
        PharmacyReport savedReport = reportRepository.save(report);
        return mapToResponse(savedReport);
    }
    
    @Override
    public ReportResponse generateStockDistribution(String generatedBy) {
        List<Drug> allDrugs = drugRepository.findAll();
        
        Map<String, Object> data = new HashMap<>();
        data.put("totalDrugs", allDrugs.size());
        data.put("inStockCount", allDrugs.stream().filter(d -> d.getStatus() == DrugStatus.IN_STOCK).count());
        data.put("lowStockCount", allDrugs.stream().filter(d -> d.getStatus() == DrugStatus.LOW_STOCK).count());
        data.put("outOfStockCount", allDrugs.stream().filter(d -> d.getStatus() == DrugStatus.OUT_OF_STOCK).count());
        data.put("expiredCount", allDrugs.stream().filter(d -> d.getStatus() == DrugStatus.EXPIRED).count());
        
        // Calculate percentage distribution
        int total = allDrugs.size();
        if (total > 0) {
            data.put("inStockPercentage", (double) allDrugs.stream().filter(d -> d.getStatus() == DrugStatus.IN_STOCK).count() / total * 100);
            data.put("lowStockPercentage", (double) allDrugs.stream().filter(d -> d.getStatus() == DrugStatus.LOW_STOCK).count() / total * 100);
            data.put("outOfStockPercentage", (double) allDrugs.stream().filter(d -> d.getStatus() == DrugStatus.OUT_OF_STOCK).count() / total * 100);
            data.put("expiredPercentage", (double) allDrugs.stream().filter(d -> d.getStatus() == DrugStatus.EXPIRED).count() / total * 100);
        }
        
        PharmacyReport report = new PharmacyReport();
        report.setReportType("STOCK_DISTRIBUTION");
        report.setData(data);
        report.setGeneratedBy(generatedBy);
        report.setDescription("Stock distribution showing inventory status breakdown");
        report.setCreatedAt(LocalDateTime.now());
        
        PharmacyReport savedReport = reportRepository.save(report);
        return mapToResponse(savedReport);
    }
    
    @Override
    public ReportResponse generateInventorySummary(String generatedBy) {
        List<Drug> allDrugs = drugRepository.findAll();
        
        Map<String, Object> data = new HashMap<>();
        data.put("totalDrugs", allDrugs.size());
        data.put("totalQuantity", allDrugs.stream().mapToInt(Drug::getQuantity).sum());
        data.put("totalValue", allDrugs.stream()
                .filter(d -> d.getPrice() != null)
                .mapToDouble(d -> d.getPrice() * d.getQuantity())
                .sum());
        data.put("lowStockItems", drugRepository.findByQuantityLessThanEqual(10).size());
        data.put("drugsByStatus", getDrugsByStatus());
        data.put("expiringDrugs", getExpiringDrugs(30)); // Drugs expiring in next 30 days
        
        PharmacyReport report = new PharmacyReport();
        report.setReportType("INVENTORY_SUMMARY");
        report.setData(data);
        report.setGeneratedBy(generatedBy);
        report.setDescription("Comprehensive inventory summary with stock levels and values");
        report.setCreatedAt(LocalDateTime.now());
        
        PharmacyReport savedReport = reportRepository.save(report);
        return mapToResponse(savedReport);
    }
    
    @Override
    public ReportResponse generateDispensedMedicationsReport(LocalDateTime startDate, LocalDateTime endDate, String generatedBy) {
        List<Prescription> dispensedPrescriptions = prescriptionRepository.findByStatus(PrescriptionStatus.DISPENSED);
        
        if (startDate != null && endDate != null) {
            dispensedPrescriptions = dispensedPrescriptions.stream()
                    .filter(p -> p.getDispensedAt() != null && 
                            p.getDispensedAt().isAfter(startDate) && 
                            p.getDispensedAt().isBefore(endDate))
                    .collect(Collectors.toList());
        }
        
        Map<String, Object> data = new HashMap<>();
        data.put("totalDispensed", dispensedPrescriptions.size());
        data.put("medicationsByDrug", getMedicationsByDrug(dispensedPrescriptions));
        data.put("dispensedByPharmacist", getDispensedByPharmacist(dispensedPrescriptions));
        
        PharmacyReport report = new PharmacyReport();
        report.setReportType("DISPENSED_MEDICATIONS");
        report.setData(data);
        report.setGeneratedBy(generatedBy);
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setDescription("Report of all dispensed medications in the given period");
        report.setCreatedAt(LocalDateTime.now());
        
        PharmacyReport savedReport = reportRepository.save(report);
        return mapToResponse(savedReport);
    }
    
    @Override
    public ReportResponse generateLowStockAlert(String generatedBy) {
        List<Drug> lowStockDrugs = drugRepository.findByQuantityLessThanEqual(10);
        
        Map<String, Object> data = new HashMap<>();
        data.put("lowStockCount", lowStockDrugs.size());
        data.put("lowStockDrugs", lowStockDrugs.stream()
                .map(drug -> Map.of(
                        "name", drug.getName(),
                        "dosage", drug.getDosage(),
                        "quantity", drug.getQuantity(),
                        "status", drug.getStatus().toString()
                ))
                .collect(Collectors.toList()));
        data.put("criticalItems", lowStockDrugs.stream()
                .filter(d -> d.getQuantity() <= 3)
                .count());
        
        PharmacyReport report = new PharmacyReport();
        report.setReportType("LOW_STOCK_ALERT");
        report.setData(data);
        report.setGeneratedBy(generatedBy);
        report.setDescription("Alert report for low stock items requiring immediate attention");
        report.setCreatedAt(LocalDateTime.now());
        
        PharmacyReport savedReport = reportRepository.save(report);
        return mapToResponse(savedReport);
    }
    
    @Override
    public List<ReportResponse> getAllReports() {
        return reportRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public ReportResponse getReportById(String id) {
        PharmacyReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
        return mapToResponse(report);
    }
    
    @Override
    public List<ReportResponse> getReportsByType(String reportType) {
        return reportRepository.findByReportType(reportType).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    // Helper methods
    
    private Double calculateRevenue(List<Prescription> prescriptions) {
        double total = 0.0;
        for (Prescription p : prescriptions) {
            Optional<Drug> drugOpt = drugRepository.findById(p.getDrugId());
            if (drugOpt.isPresent() && drugOpt.get().getPrice() != null) {
                total += drugOpt.get().getPrice() * p.getQuantity();
            }
        }
        return total;
    }
    
    private Map<String, Integer> getMedicationsSoldCount(List<Prescription> prescriptions) {
        return prescriptions.stream()
                .collect(Collectors.groupingBy(
                        Prescription::getDrugName,
                        Collectors.summingInt(Prescription::getQuantity)
                ));
    }
    
    private List<Map<String, Object>> getTopSellingDrugs(List<Prescription> prescriptions, int limit) {
        return prescriptions.stream()
                .collect(Collectors.groupingBy(Prescription::getDrugName, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> Map.of("drugName", (Object) entry.getKey(), "count", entry.getValue()))
                .collect(Collectors.toList());
    }
    
    private Map<String, Long> getDrugsByStatus() {
        List<Drug> allDrugs = drugRepository.findAll();
        return allDrugs.stream()
                .collect(Collectors.groupingBy(
                        drug -> drug.getStatus().toString(),
                        Collectors.counting()
                ));
    }
    
    private List<Map<String, Object>> getExpiringDrugs(int days) {
        LocalDateTime threshold = LocalDateTime.now().plusDays(days);
        return drugRepository.findAll().stream()
                .filter(d -> d.getExpiryDate() != null && 
                        d.getExpiryDate().isBefore(threshold) && 
                        d.getExpiryDate().isAfter(LocalDateTime.now()))
                .map(drug -> Map.of(
                        "name", (Object) drug.getName(),
                        "expiryDate", drug.getExpiryDate(),
                        "quantity", drug.getQuantity()
                ))
                .collect(Collectors.toList());
    }
    
    private Map<String, Integer> getMedicationsByDrug(List<Prescription> prescriptions) {
        return prescriptions.stream()
                .collect(Collectors.groupingBy(
                        Prescription::getDrugName,
                        Collectors.summingInt(Prescription::getQuantity)
                ));
    }
    
    private Map<String, Long> getDispensedByPharmacist(List<Prescription> prescriptions) {
        return prescriptions.stream()
                .filter(p -> p.getPharmacistName() != null)
                .collect(Collectors.groupingBy(
                        Prescription::getPharmacistName,
                        Collectors.counting()
                ));
    }
    
    /**
     * Helper method to map PharmacyReport entity to ReportResponse DTO
     */
    private ReportResponse mapToResponse(PharmacyReport report) {
        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setReportType(report.getReportType());
        response.setData(report.getData());
        response.setGeneratedBy(report.getGeneratedBy());
        response.setStartDate(report.getStartDate());
        response.setEndDate(report.getEndDate());
        response.setDescription(report.getDescription());
        response.setCreatedAt(report.getCreatedAt());
        return response;
    }
}
