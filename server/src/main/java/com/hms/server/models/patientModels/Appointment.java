package com.hms.server.models.patientModels;

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
@Document(collection = "appointments")
public class Appointment {

    @Id
    private String id;

    @NotNull
    @Indexed
    private String patientId;

    @NotNull
    @Indexed
    private String doctorId;

    @NotBlank
    private String patientName;

    @NotBlank
    private String doctorName;

    private String doctorSpecialization;

    private String patientEmail;

    private String doctorEmail;

    @NotNull
    @Future
    private LocalDateTime appointmentAt;

    @NotBlank
    private String reason;

    private Status status = Status.SCHEDULED;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Status {
        SCHEDULED,
        COMPLETED,
        CANCELLED
    }
}
