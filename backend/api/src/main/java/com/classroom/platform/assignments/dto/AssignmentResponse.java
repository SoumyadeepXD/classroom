package com.classroom.platform.assignments.dto;

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
public class AssignmentResponse {

    private UUID id;
    private UUID classroomId;
    private String title;
    private String description;
    private Instant dueDate;
    private Instant lockDate;
    private BigDecimal maxPoints;
    private String rubricData;
    private Instant createdAt;
}
