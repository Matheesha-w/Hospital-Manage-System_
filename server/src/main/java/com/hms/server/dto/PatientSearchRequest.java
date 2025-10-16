package com.hms.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientSearchRequest {
    private String searchType;  // e.g. "NAME", "ID", "EMAIL"
    private String searchTerm;  // e.g. "John", "P001", "john@email.com"
}
