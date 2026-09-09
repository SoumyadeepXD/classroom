package com.classroom.platform.assignments.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

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

    public AssignmentResponse() {}

    public AssignmentResponse(UUID id, UUID classroomId, String title, String description,
                              Instant dueDate, Instant lockDate, BigDecimal maxPoints, String rubricData, Instant createdAt) {
        this.id = id;
        this.classroomId = classroomId;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.lockDate = lockDate;
        this.maxPoints = maxPoints;
        this.rubricData = rubricData;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private UUID classroomId;
        private String title;
        private String description;
        private Instant dueDate;
        private Instant lockDate;
        private BigDecimal maxPoints;
        private String rubricData;
        private Instant createdAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder classroomId(UUID classroomId) { this.classroomId = classroomId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder dueDate(Instant dueDate) { this.dueDate = dueDate; return this; }
        public Builder lockDate(Instant lockDate) { this.lockDate = lockDate; return this; }
        public Builder maxPoints(BigDecimal maxPoints) { this.maxPoints = maxPoints; return this; }
        public Builder rubricData(String rubricData) { this.rubricData = rubricData; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public AssignmentResponse build() {
            return new AssignmentResponse(id, classroomId, title, description, dueDate, lockDate, maxPoints, rubricData, createdAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getClassroomId() { return classroomId; }
    public void setClassroomId(UUID classroomId) { this.classroomId = classroomId; }

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

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
