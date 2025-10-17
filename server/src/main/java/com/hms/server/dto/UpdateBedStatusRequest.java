package com.hms.server.dto;

import com.hms.server.model.WardBed;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateBedStatusRequest {
    @NotBlank
    private String wardNo;
    @NotBlank
    private String bedNo;
    @NotNull
    private WardBed.BedStatus status;

    public String getWardNo() { return wardNo; }
    public void setWardNo(String wardNo) { this.wardNo = wardNo; }
    public String getBedNo() { return bedNo; }
    public void setBedNo(String bedNo) { this.bedNo = bedNo; }
    public WardBed.BedStatus getStatus() { return status; }
    public void setStatus(WardBed.BedStatus status) { this.status = status; }
}
