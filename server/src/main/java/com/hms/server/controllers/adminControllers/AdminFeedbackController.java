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
        return ResponseEntity.ok(feedbackService.getAllFeedbacks(false));
    }

    @GetMapping("/approved")
    public ResponseEntity<List<FeedbackResponse>> getApprovedFeedbacks() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks(true));
    }

    @PostMapping("/approve/{feedbackId}")
    public ResponseEntity<FeedbackResponse> approveFeedback(@PathVariable String feedbackId) {
        return ResponseEntity.ok(feedbackService.approveFeedback(feedbackId));
    }
}
