package com.classroom.platform.grades.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class GradeResponse {

    private UUID id;
    private UUID submissionId;
    private UUID gradedByUserId;
    private BigDecimal score;
    private String rubricBreakdown;
    private String privateFeedback;
    private Boolean released;
    private Instant gradedAt;

    public GradeResponse() {}

    public GradeResponse(UUID id, UUID submissionId, UUID gradedByUserId, BigDecimal score,
                         String rubricBreakdown, String privateFeedback, Boolean released, Instant gradedAt) {
        this.id = id;
        this.submissionId = submissionId;
        this.gradedByUserId = gradedByUserId;
        this.score = score;
        this.rubricBreakdown = rubricBreakdown;
        this.privateFeedback = privateFeedback;
        this.released = released;
        this.gradedAt = gradedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private UUID submissionId;
        private UUID gradedByUserId;
        private BigDecimal score;
        private String rubricBreakdown;
        private String privateFeedback;
        private Boolean released;
        private Instant gradedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder submissionId(UUID submissionId) { this.submissionId = submissionId; return this; }
        public Builder gradedByUserId(UUID gradedByUserId) { this.gradedByUserId = gradedByUserId; return this; }
        public Builder score(BigDecimal score) { this.score = score; return this; }
        public Builder rubricBreakdown(String rubricBreakdown) { this.rubricBreakdown = rubricBreakdown; return this; }
        public Builder privateFeedback(String privateFeedback) { this.privateFeedback = privateFeedback; return this; }
        public Builder released(Boolean released) { this.released = released; return this; }
        public Builder gradedAt(Instant gradedAt) { this.gradedAt = gradedAt; return this; }

        public GradeResponse build() {
            return new GradeResponse(id, submissionId, gradedByUserId, score, rubricBreakdown, privateFeedback, released, gradedAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getSubmissionId() { return submissionId; }
    public void setSubmissionId(UUID submissionId) { this.submissionId = submissionId; }

    public UUID getGradedByUserId() { return gradedByUserId; }
    public void setGradedByUserId(UUID gradedByUserId) { this.gradedByUserId = gradedByUserId; }

    public BigDecimal getScore() { return score; }
    public void setScore(BigDecimal score) { this.score = score; }

    public String getRubricBreakdown() { return rubricBreakdown; }
    public void setRubricBreakdown(String rubricBreakdown) { this.rubricBreakdown = rubricBreakdown; }

    public String getPrivateFeedback() { return privateFeedback; }
    public void setPrivateFeedback(String privateFeedback) { this.privateFeedback = privateFeedback; }

    public Boolean getReleased() { return released; }
    public void setReleased(Boolean released) { this.released = released; }

    public Instant getGradedAt() { return gradedAt; }
    public void setGradedAt(Instant gradedAt) { this.gradedAt = gradedAt; }
}
