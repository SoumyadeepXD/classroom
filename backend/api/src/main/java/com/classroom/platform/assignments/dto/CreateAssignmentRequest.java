package com.classroom.platform.assignments.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAssignmentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Due date is required")
    private Instant dueDate;

    private Instant lockDate;

    @NotNull(message = "Maximum points is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Max points must be greater than 0")
    private BigDecimal maxPoints;

    private String rubricData;
}
