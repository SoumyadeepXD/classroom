package com.classroom.platform.assignments.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;

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

    public CreateAssignmentRequest() {}

    public CreateAssignmentRequest(String title, String description, Instant dueDate, Instant lockDate,
                                   BigDecimal maxPoints, String rubricData) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.lockDate = lockDate;
        this.maxPoints = maxPoints;
        this.rubricData = rubricData;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Instant getDueDate() { return dueDate; }
    public void setDueDate(Instant dueDate) { this.dueDate = dueDate; }

    public Instant getLockDate() { return lockDate; }
    public void setLockDate(Instant lockDate) { this.lockDate = lockDate; }

    public BigDecimal getMaxPoints() { return maxPoints; }
    public void setMaxPoints(BigDecimal maxPoints) { this.maxPoints = maxPoints; }

    public String getRubricData() { return rubricData; }
    public void setRubricData(String rubricData) { this.rubricData = rubricData; }
}
