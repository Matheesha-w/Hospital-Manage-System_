package com.hms.server.dto.pharmacist;

import com.hms.server.models.pharmacistModels.Drug.DrugStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrugRequest {
    
    @NotBlank(message = "Drug name is required")
    private String name;
    
    @NotBlank(message = "Dosage is required")
    private String dosage;
    
    @NotNull(message = "Quantity is required")
    private Integer quantity;
    
    private DrugStatus status;
    
    private String description;
    
    private Double price;
    
    private String manufacturer;
    
    private LocalDateTime expiryDate;
}
