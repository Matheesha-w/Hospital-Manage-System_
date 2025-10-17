package com.hms.server.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateBedRequest {
    @NotBlank
    private String wardNo;
    @NotBlank
    private String bedNo;

    public String getWardNo() { return wardNo; }
    public void setWardNo(String wardNo) { this.wardNo = wardNo; }

    public String getBedNo() { return bedNo; }
    public void setBedNo(String bedNo) { this.bedNo = bedNo; }
}
