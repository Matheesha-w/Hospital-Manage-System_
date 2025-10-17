package com.hms.server.dto.doctor;

import lombok.Data;

import java.time.LocalDateTime;

public class DoctorAppointmentDtos {

    @Data
    public static class ResponseItem {
        private String id;
        private String patientId;
        private String patientName;
        private String patientEmail;
        private LocalDateTime appointmentAt;
        private String reason;
        private String status;
        private String doctorId;
        private String doctorName;
        private String doctorEmail;
        private String doctorSpecialization;
    }
}
