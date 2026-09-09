package com.classroom.platform.grades.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeSubmissionRequest {

    @NotNull(message = "Total score is required")
    @DecimalMin(value = "0.0", message = "Score cannot be negative")
    private BigDecimal totalScore;

    private String privateFeedback;
    private String rubricBreakdown;

    @Builder.Default
    private Boolean releaseImmediately = true;
}
