package com.hms.server.controllers.patientControllers;

import com.hms.server.dto.patient.FeedbackRequest;
import com.hms.server.dto.patient.FeedbackResponse;
import com.hms.server.service.patient.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient/feedback")
public class FeedbackController {
    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<FeedbackResponse> submitFeedback(@RequestBody FeedbackRequest request) {
        FeedbackResponse response = feedbackService.submitFeedback(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my/{patientId}")
    public ResponseEntity<List<FeedbackResponse>> getMyFeedbacks(@PathVariable String patientId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByPatient(patientId));
    }
}
