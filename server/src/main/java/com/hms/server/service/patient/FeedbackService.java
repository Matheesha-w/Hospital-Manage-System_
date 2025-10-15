package com.hms.server.service.patient;

import com.hms.server.dto.patient.FeedbackRequest;
import com.hms.server.dto.patient.FeedbackResponse;
import com.hms.server.models.patientModels.Feedback;
import com.hms.server.repository.patient.FeedbackRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public FeedbackResponse submitFeedback(FeedbackRequest request) {
    Feedback feedback = new Feedback(request.getPatientId(), request.getMessage());
    Feedback saved = feedbackRepository.save(feedback);
    return toResponse(saved);
    }

    public List<FeedbackResponse> getFeedbacksByPatient(String patientId) {
        return feedbackRepository.findByPatientId(patientId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<FeedbackResponse> getAllFeedbacks(boolean approved) {
        return (approved ? feedbackRepository.findByApprovedTrue() : feedbackRepository.findByApprovedFalse())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public FeedbackResponse approveFeedback(String feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId).orElseThrow();
        feedback.setApproved(true);
        Feedback saved = feedbackRepository.save(feedback);
        return toResponse(saved);
    }

    private FeedbackResponse toResponse(Feedback feedback) {
        FeedbackResponse res = new FeedbackResponse();
        res.setId(feedback.getId());
        res.setPatientId(feedback.getPatientId());
        res.setMessage(feedback.getMessage());
        res.setApproved(feedback.isApproved());
        res.setSubmittedAt(feedback.getSubmittedAt());
        return res;
    }
}
