package com.hms.server.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignBedRequest {
    @NotBlank
    private String wardNo;
    @NotBlank
    private String bedNo;
    @NotBlank
    private String patientId; // users collection id

    public String getWardNo() { return wardNo; }
    public void setWardNo(String wardNo) { this.wardNo = wardNo; }
    public String getBedNo() { return bedNo; }
    public void setBedNo(String bedNo) { this.bedNo = bedNo; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
}
