package com.hms.server.mappers;

import com.hms.server.dto.doctor.SurgeryDtos;
import com.hms.server.models.doctor.Surgery;

public final class SurgeryMapper {
    private SurgeryMapper() {}

    public static SurgeryDtos.ResponseItem toResponse(Surgery surgery) {
        SurgeryDtos.ResponseItem response = new SurgeryDtos.ResponseItem();
        response.setId(surgery.getId());
        response.setPatientId(surgery.getPatientId());
        response.setPatientName(surgery.getPatientName());
        response.setCondition(surgery.getCondition());
        response.setNotes(surgery.getNotes());
        response.setOperatingRoom(surgery.getOperatingRoom());
        response.setSurgeryType(surgery.getSurgeryType());
        response.setUrgency(surgery.getUrgency());
        response.setScheduledAt(surgery.getScheduledAt());
        response.setStatus(surgery.getStatus() != null ? surgery.getStatus().name() : null);
        response.setCreatedAt(surgery.getCreatedAt());
        response.setUpdatedAt(surgery.getUpdatedAt());
        response.setCompletedAt(surgery.getCompletedAt());
        return response;
    }
}
