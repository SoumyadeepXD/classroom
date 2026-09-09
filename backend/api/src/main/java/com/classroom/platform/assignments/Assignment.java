package com.classroom.platform.assignments;

import com.classroom.platform.classrooms.Classroom;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "due_date", nullable = false)
    private Instant dueDate;

    @Column(name = "lock_date")
    private Instant lockDate;

    @Column(name = "max_points", nullable = false, precision = 6, scale = 2)
    private BigDecimal maxPoints = new BigDecimal("100.00");

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "rubric_data", columnDefinition = "jsonb", nullable = false)
    private String rubricData = "[]";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public Assignment() {}

    public Assignment(UUID id, Classroom classroom, String title, String description,
                      Instant dueDate, Instant lockDate, BigDecimal maxPoints, String rubricData) {
        this.id = id;
        this.classroom = classroom;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.lockDate = lockDate;
        this.maxPoints = maxPoints != null ? maxPoints : new BigDecimal("100.00");
        this.rubricData = rubricData != null ? rubricData : "[]";
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private Classroom classroom;
        private String title;
        private String description;
        private Instant dueDate;
        private Instant lockDate;
        private BigDecimal maxPoints = new BigDecimal("100.00");
        private String rubricData = "[]";

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder classroom(Classroom classroom) { this.classroom = classroom; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder dueDate(Instant dueDate) { this.dueDate = dueDate; return this; }
        public Builder lockDate(Instant lockDate) { this.lockDate = lockDate; return this; }
        public Builder maxPoints(BigDecimal maxPoints) { this.maxPoints = maxPoints; return this; }
        public Builder rubricData(String rubricData) { this.rubricData = rubricData; return this; }

        public Assignment build() {
            return new Assignment(id, classroom, title, description, dueDate, lockDate, maxPoints, rubricData);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Classroom getClassroom() { return classroom; }
    public void setClassroom(Classroom classroom) { this.classroom = classroom; }

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
    public Instant getUpdatedAt() { return updatedAt; }

    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }
}
