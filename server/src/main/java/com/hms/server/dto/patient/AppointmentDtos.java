package com.hms.server.dto.patient;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class AppointmentDtos {

    @Data
    public static class CreateRequest {
        @NotNull
        private String doctorId;

        @NotNull
        @Future
        private LocalDateTime appointmentAt;

        @NotBlank
        private String reason;
    }

    @Data
    public static class ResponseItem {
        private String id;
        private String doctorId;
        private String doctorName;
        private String doctorSpecialization;
        private String doctorEmail;
        private LocalDateTime appointmentAt;
        private String reason;
        private String status;
    }

    @Data
    public static class DoctorOption {
        private String id;
        private String name;
        private String specialization;
        private String email;
    }
}
