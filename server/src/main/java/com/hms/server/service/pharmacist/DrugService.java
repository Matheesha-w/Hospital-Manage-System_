package com.hms.server.service.pharmacist;

import com.hms.server.dto.pharmacist.DrugRequest;
import com.hms.server.dto.pharmacist.DrugResponse;
import com.hms.server.models.pharmacistModels.Drug.DrugStatus;

import java.util.List;

/**
 * Service interface for Drug inventory management
 * Follows Interface Segregation Principle - contains only drug-related operations
 */
public interface DrugService {
    
    /**
     * Get all drugs in inventory
     */
    List<DrugResponse> getAllDrugs();
    
    /**
     * Get drug by ID
     */
    DrugResponse getDrugById(String id);
    
    /**
     * Add new drug to inventory
     */
    DrugResponse addDrug(DrugRequest request);
    
    /**
     * Update existing drug
     */
    DrugResponse updateDrug(String id, DrugRequest request);
    
    /**
     * Delete drug from inventory
     */
    void deleteDrug(String id);
    
    /**
     * Get drugs by status
     */
    List<DrugResponse> getDrugsByStatus(DrugStatus status);
    
    /**
     * Search drugs by name
     */
    List<DrugResponse> searchDrugsByName(String name);
    
    /**
     * Check stock level and update status
     */
    DrugResponse checkStockLevel(String id);
    
    /**
     * Update drug quantity
     */
    DrugResponse updateQuantity(String id, Integer quantity);
    
    /**
     * Mark drug as expired
     */
    DrugResponse markExpired(String id);
    
    /**
     * Get low stock drugs
     */
    List<DrugResponse> getLowStockDrugs();
}
