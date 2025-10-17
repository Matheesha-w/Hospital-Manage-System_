package com.hms.server.controllers.adminControllers;

import com.hms.server.dto.patient.FeedbackResponse;
import com.hms.server.service.patient.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/feedback")
public class AdminFeedbackController {
    private final FeedbackService feedbackService;

    public AdminFeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<FeedbackResponse>> getPendingFeedbacks() {
        try {
            return ResponseEntity.ok(feedbackService.getAllFeedbacks(false));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/approved")
    public ResponseEntity<List<FeedbackResponse>> getApprovedFeedbacks() {
        try {
            return ResponseEntity.ok(feedbackService.getAllFeedbacks(true));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/approve/{feedbackId}")
    public ResponseEntity<FeedbackResponse> approveFeedback(@PathVariable String feedbackId) {
        try {
            return ResponseEntity.ok(feedbackService.approveFeedback(feedbackId));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
