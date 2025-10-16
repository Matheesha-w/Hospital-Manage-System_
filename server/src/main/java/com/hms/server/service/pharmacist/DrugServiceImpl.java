package com.hms.server.service.pharmacist;

import com.hms.server.dto.pharmacist.DrugRequest;
import com.hms.server.dto.pharmacist.DrugResponse;
import com.hms.server.models.pharmacistModels.Drug;
import com.hms.server.models.pharmacistModels.Drug.DrugStatus;
import com.hms.server.repository.pharmacist.DrugRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of DrugService
 * Follows Single Responsibility Principle - handles only drug inventory logic
 * Follows Dependency Inversion Principle - depends on DrugRepository abstraction
 */
@Service
@RequiredArgsConstructor
public class DrugServiceImpl implements DrugService {
    
    private final DrugRepository drugRepository;
    
    @Override
    public List<DrugResponse> getAllDrugs() {
        return drugRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public DrugResponse getDrugById(String id) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + id));
        return mapToResponse(drug);
    }
    
    @Override
    public DrugResponse addDrug(DrugRequest request) {
        Drug drug = new Drug();
        drug.setName(request.getName());
        drug.setDosage(request.getDosage());
        drug.setQuantity(request.getQuantity());
        drug.setDescription(request.getDescription());
        drug.setPrice(request.getPrice());
        drug.setManufacturer(request.getManufacturer());
        drug.setExpiryDate(request.getExpiryDate());
        drug.setCreatedAt(LocalDateTime.now());
        drug.setUpdatedAt(LocalDateTime.now());
        
        // Automatically set status based on quantity and expiry
        drug.setStatus(drug.checkStockStatus());
        
        Drug savedDrug = drugRepository.save(drug);
        return mapToResponse(savedDrug);
    }
    
    @Override
    public DrugResponse updateDrug(String id, DrugRequest request) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + id));
        
        drug.setName(request.getName());
        drug.setDosage(request.getDosage());
        drug.setQuantity(request.getQuantity());
        drug.setDescription(request.getDescription());
        drug.setPrice(request.getPrice());
        drug.setManufacturer(request.getManufacturer());
        drug.setExpiryDate(request.getExpiryDate());
        drug.setUpdatedAt(LocalDateTime.now());
        
        // Update status based on new values
        drug.setStatus(drug.checkStockStatus());
        
        Drug updatedDrug = drugRepository.save(drug);
        return mapToResponse(updatedDrug);
    }
    
    @Override
    public void deleteDrug(String id) {
        if (!drugRepository.existsById(id)) {
            throw new RuntimeException("Drug not found with id: " + id);
        }
        drugRepository.deleteById(id);
    }
    
    @Override
    public List<DrugResponse> getDrugsByStatus(DrugStatus status) {
        return drugRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<DrugResponse> searchDrugsByName(String name) {
        return drugRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public DrugResponse checkStockLevel(String id) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + id));
        
        DrugStatus newStatus = drug.checkStockStatus();
        drug.setStatus(newStatus);
        drug.setUpdatedAt(LocalDateTime.now());
        
        Drug updatedDrug = drugRepository.save(drug);
        return mapToResponse(updatedDrug);
    }
    
    @Override
    public DrugResponse updateQuantity(String id, Integer quantity) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + id));
        
        drug.setQuantity(quantity);
        drug.setStatus(drug.checkStockStatus());
        drug.setUpdatedAt(LocalDateTime.now());
        
        Drug updatedDrug = drugRepository.save(drug);
        return mapToResponse(updatedDrug);
    }
    
    @Override
    public DrugResponse markExpired(String id) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + id));
        
        drug.setStatus(DrugStatus.EXPIRED);
        drug.setUpdatedAt(LocalDateTime.now());
        
        Drug updatedDrug = drugRepository.save(drug);
        return mapToResponse(updatedDrug);
    }
    
    @Override
    public List<DrugResponse> getLowStockDrugs() {
        return drugRepository.findByQuantityLessThanEqual(10).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Helper method to map Drug entity to DrugResponse DTO
     */
    private DrugResponse mapToResponse(Drug drug) {
        DrugResponse response = new DrugResponse();
        response.setId(drug.getId());
        response.setName(drug.getName());
        response.setDosage(drug.getDosage());
        response.setQuantity(drug.getQuantity());
        response.setStatus(drug.getStatus());
        response.setDescription(drug.getDescription());
        response.setPrice(drug.getPrice());
        response.setManufacturer(drug.getManufacturer());
        response.setExpiryDate(drug.getExpiryDate());
        response.setCreatedAt(drug.getCreatedAt());
        response.setUpdatedAt(drug.getUpdatedAt());
        return response;
    }
}
