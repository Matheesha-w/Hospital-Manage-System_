package com.hms.server.dto.pharmacist;

import com.hms.server.models.pharmacistModels.Drug.DrugStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrugResponse {
    
    private String id;
    private String name;
    private String dosage;
    private Integer quantity;
    private DrugStatus status;
    private String description;
    private Double price;
    private String manufacturer;
    private LocalDateTime expiryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
