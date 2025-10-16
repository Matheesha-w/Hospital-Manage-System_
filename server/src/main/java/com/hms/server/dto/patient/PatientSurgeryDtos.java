package com.hms.server.dto.patient;

import lombok.Data;

import java.time.LocalDateTime;

public class PatientSurgeryDtos {

    @Data
    public static class ResponseItem {
        private String id;
        private String condition;
        private String notes;
        private String operatingRoom;
        private String surgeryType;
        private String urgency;
        private LocalDateTime scheduledAt;
        private String status;
        private LocalDateTime completedAt;

        private String doctorName;
        private String doctorEmail;
    }
}
