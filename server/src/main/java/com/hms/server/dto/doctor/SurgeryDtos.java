package com.hms.server.dto.doctor;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class SurgeryDtos {

    @Data
    public static class CreateRequest {
        @NotNull
        private String patientId;

        @NotBlank
        private String condition;
        @NotBlank
        private String urgency;

        private String notes;

        @NotBlank
        private String operatingRoom;

        @NotBlank
        private String surgeryType;

        @NotNull
        @Future
        private LocalDateTime scheduledAt;
    }

    @Data
    public static class UpdateRequest {
        @NotBlank
        private String id;

        private String condition;
        private String notes;
        private String urgency;

        private String operatingRoom;

        private String surgeryType;

        @Future
        private LocalDateTime scheduledAt;
    }

    @Data
    public static class ResponseItem {
        private String id;
        private String patientId;
        private String patientName;
        private String condition;
        private String notes;
        private String operatingRoom;
        private String surgeryType;
        private String urgency;
        private LocalDateTime scheduledAt;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    public static class CountsResponse {
        private long completed;
        private long pending;
    }
}


