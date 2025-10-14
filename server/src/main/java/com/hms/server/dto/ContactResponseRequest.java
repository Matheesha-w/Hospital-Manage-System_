package com.hms.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContactResponseRequest {
    @NotBlank
    private String response;
}


