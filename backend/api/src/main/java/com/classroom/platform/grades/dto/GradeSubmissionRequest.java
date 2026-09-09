package com.classroom.platform.grades.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class GradeSubmissionRequest {

    @NotNull(message = "Total score is required")
    @DecimalMin(value = "0.0", message = "Score cannot be negative")
    private BigDecimal totalScore;

    private String privateFeedback;
    private String rubricBreakdown;
    private Boolean releaseImmediately = true;

    public GradeSubmissionRequest() {}

    public GradeSubmissionRequest(BigDecimal totalScore, String privateFeedback, String rubricBreakdown, Boolean releaseImmediately) {
        this.totalScore = totalScore;
        this.privateFeedback = privateFeedback;
        this.rubricBreakdown = rubricBreakdown;
        this.releaseImmediately = releaseImmediately != null ? releaseImmediately : true;
    }

    public BigDecimal getTotalScore() { return totalScore; }
    public void setTotalScore(BigDecimal totalScore) { this.totalScore = totalScore; }

    public String getPrivateFeedback() { return privateFeedback; }
    public void setPrivateFeedback(String privateFeedback) { this.privateFeedback = privateFeedback; }

    public String getRubricBreakdown() { return rubricBreakdown; }
    public void setRubricBreakdown(String rubricBreakdown) { this.rubricBreakdown = rubricBreakdown; }

    public Boolean getReleaseImmediately() { return releaseImmediately; }
    public void setReleaseImmediately(Boolean releaseImmediately) { this.releaseImmediately = releaseImmediately; }
}
