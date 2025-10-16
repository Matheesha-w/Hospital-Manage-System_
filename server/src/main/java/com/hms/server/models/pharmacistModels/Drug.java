package com.hms.server.models.pharmacistModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "drugs")
public class Drug {
    
    @Id
    private String id;
    
    @NotBlank(message = "Drug name is required")
    private String name;
    
    @NotBlank(message = "Dosage is required")
    private String dosage;
    
    @NotNull(message = "Quantity is required")
    private Integer quantity;
    
    @NotNull(message = "Status is required")
    private DrugStatus status;
    
    private String description;
    
    private Double price;
    
    private String manufacturer;
    
    private LocalDateTime expiryDate;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public enum DrugStatus {
        IN_STOCK,
        LOW_STOCK,
        OUT_OF_STOCK,
        EXPIRED
    }
    
    // Helper method to check stock level
    public DrugStatus checkStockStatus() {
        if (expiryDate != null && expiryDate.isBefore(LocalDateTime.now())) {
            return DrugStatus.EXPIRED;
        }
        if (quantity == 0) {
            return DrugStatus.OUT_OF_STOCK;
        }
        if (quantity <= 10) {
            return DrugStatus.LOW_STOCK;
        }
        return DrugStatus.IN_STOCK;
    }
}
