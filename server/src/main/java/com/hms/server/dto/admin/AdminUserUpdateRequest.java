package com.hms.server.dto.admin;

import com.hms.server.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AdminUserUpdateRequest {
    @Size(min = 3, max = 50)
    private String username;

    @Email
    private String email;

    @Size(min = 6)
    private String password;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;
    private Boolean active;
    private Boolean approved;

    private User.Role role;

    private String specialization;
    private String department;
    private String licenseNumber;
}


