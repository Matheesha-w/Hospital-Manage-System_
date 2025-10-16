package com.hms.server.dto;

import com.hms.server.model.Patient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {
    private String id;
    private String patientId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private int age;
    private String address;
    private String emergencyContact;
    private String emergencyPhone;
    private String bloodType;
    private List<String> allergies;
    private List<String> medicalConditions;
    private boolean active;

    public static PatientResponse fromPatient(Patient patient) {
        PatientResponse response = new PatientResponse();
        response.setId(patient.getId());
        response.setPatientId(patient.getPatientId());
        response.setFirstName(patient.getFirstName());
        response.setLastName(patient.getLastName());
        response.setFullName(patient.getFullName());
        response.setEmail(patient.getEmail());
        response.setPhoneNumber(patient.getPhoneNumber());
        response.setDateOfBirth(patient.getDateOfBirth());
        response.setAge(patient.getAge());
        response.setAddress(patient.getAddress());
        response.setEmergencyContact(patient.getEmergencyContact());
        response.setEmergencyPhone(patient.getEmergencyPhone());
        response.setBloodType(patient.getBloodType());
        response.setAllergies(patient.getAllergies());
        response.setMedicalConditions(patient.getMedicalConditions());
        response.setActive(patient.isActive());
        return response;
    }
}
