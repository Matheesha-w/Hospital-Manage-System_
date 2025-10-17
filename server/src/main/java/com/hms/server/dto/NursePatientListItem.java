package com.hms.server.dto;

import com.hms.server.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NursePatientListItem {
    private String id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private boolean active;
    private boolean approved;

    public static NursePatientListItem fromUser(User u) {
        return new NursePatientListItem(
                u.getId(),
                u.getUsername(),
                u.getFirstName(),
                u.getLastName(),
                u.getEmail(),
                u.getPhoneNumber(),
                u.getDateOfBirth(),
                u.isActive(),
                u.isApproved()
        );
    }
}
