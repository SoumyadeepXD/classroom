package com.classroom.platform.grades.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeResponse {

    private UUID id;
    private UUID submissionId;
    private UUID gradedByUserId;
    private BigDecimal score;
    private String rubricBreakdown;
    private String privateFeedback;
    private Boolean released;
    private Instant gradedAt;
}
