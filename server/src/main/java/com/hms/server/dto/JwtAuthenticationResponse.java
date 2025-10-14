package com.hms.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthenticationResponse {
    
    private String accessToken;
    private String tokenType = "Bearer";
    private String username;
    private String email;
    private Set<String> roles;
    private boolean isApproved;
}
