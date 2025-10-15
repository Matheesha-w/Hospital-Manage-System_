package com.hms.server.models.patientModels;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "feedbacks")
public class Feedback {
    @Id
    private String id;

    private String patientId;
    private String message;
    private boolean approved = false;
    private LocalDateTime submittedAt = LocalDateTime.now();

    public Feedback() {}

    public Feedback(String patientId, String message) {
        this.patientId = patientId;
        this.message = message;
        this.submittedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
