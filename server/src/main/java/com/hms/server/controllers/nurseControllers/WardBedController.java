package com.hms.server.controllers.nurseControllers;

import com.hms.server.dto.*;
import com.hms.server.model.WardBed;
import com.hms.server.service.WardBedService;
import com.hms.server.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nurse")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowedHeaders = "*",
    methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS },
    allowCredentials = "true"
)
public class WardBedController {

    @Autowired
    private WardBedService wardBedService;

    // Create bed
    @PostMapping("/beds")
    public ResponseEntity<ApiResponse> createBed(@Valid @RequestBody CreateBedRequest req) {
        try {
            WardBed bed = wardBedService.createBed(req);
            return ResponseEntity.ok(new ApiResponse(true, "Bed created", bed));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // List beds (optional filters)
    @GetMapping("/beds")
    public ResponseEntity<ApiResponse> listBeds(
            @RequestParam(value = "wardNo", required = false) String wardNo,
            @RequestParam(value = "status", required = false) WardBed.BedStatus status
    ) {
        try {
            List<WardBed> list = wardBedService.listBeds(wardNo, status);
            return ResponseEntity.ok(new ApiResponse(true, "Beds retrieved", list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Assign patient to bed
    @PostMapping("/beds/assign")
    public ResponseEntity<ApiResponse> assignBed(@Valid @RequestBody AssignBedRequest req) {
        try {
            WardBed bed = wardBedService.assignBed(req);
            return ResponseEntity.ok(new ApiResponse(true, "Bed assigned", bed));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Release bed
    @PostMapping("/beds/release")
    public ResponseEntity<ApiResponse> releaseBed(
            @RequestParam("wardNo") String wardNo,
            @RequestParam("bedNo") String bedNo
    ) {
        try {
            WardBed bed = wardBedService.releaseBed(wardNo, bedNo);
            return ResponseEntity.ok(new ApiResponse(true, "Bed released", bed));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Update bed status
    @PutMapping("/beds/status")
    public ResponseEntity<ApiResponse> updateBedStatus(@Valid @RequestBody UpdateBedStatusRequest req) {
        try {
            WardBed bed = wardBedService.updateBedStatus(req);
            return ResponseEntity.ok(new ApiResponse(true, "Bed status updated", bed));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Delete bed
    @DeleteMapping("/beds")
    public ResponseEntity<ApiResponse> deleteBed(
            @RequestParam("wardNo") String wardNo,
            @RequestParam("bedNo") String bedNo
    ) {
        try {
            wardBedService.deleteBed(wardNo, bedNo);
            return ResponseEntity.ok(new ApiResponse(true, "Bed deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
