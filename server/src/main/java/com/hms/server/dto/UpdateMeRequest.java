package com.hms.server.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateMeRequest {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;
}
