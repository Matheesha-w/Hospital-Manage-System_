package com.hms.server.models.doctor;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "surgeries")
public class Surgery {

    @Id
    private String id;

    @NotNull
    @Indexed
    private String doctorId; // references User.id with role DOCTOR

    @NotNull
    @Indexed
    private String patientId; // references User.id with role PATIENT

    @NotBlank
    private String patientName; // snapshot of patient name for convenience

    @NotBlank
    private String condition; // e.g., "Appendicitis"

    private String notes;

    @NotBlank
    private String operatingRoom; // e.g., OR-3

    @NotBlank
    private String surgeryType; // e.g., General, Orthopedic, Cardiac

    @NotBlank
    private String urgency; // e.g., EMERGENCY, URGENT, ELECTIVE

    @NotNull
    @Future(message = "Surgery date must be in the future")
    private LocalDateTime scheduledAt;

    public enum Status {
        PENDING,
        COMPLETED
    }

    // Default status is PENDING for every new surgery
    private Status status = Status.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private LocalDateTime completedAt; // Set when status changes to COMPLETED
}


