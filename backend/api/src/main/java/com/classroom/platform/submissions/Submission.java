package com.classroom.platform.submissions;

import com.classroom.platform.assignments.Assignment;
import com.classroom.platform.users.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "submissions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"assignment_id", "student_id", "version"})
})
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(nullable = false, length = 30)
    private String status = "SUBMITTED";

    @Column(nullable = false)
    private Integer version = 1;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "file_ids", columnDefinition = "jsonb", nullable = false)
    private String fileIds = "[]";

    @Column(name = "receipt_code", length = 100)
    private String receiptCode;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Submission() {}

    public Submission(UUID id, Assignment assignment, User student, String status,
                      Integer version, String fileIds, String receiptCode, Instant submittedAt) {
        this.id = id;
        this.assignment = assignment;
        this.student = student;
        this.status = status != null ? status : "SUBMITTED";
        this.version = version != null ? version : 1;
        this.fileIds = fileIds != null ? fileIds : "[]";
        this.receiptCode = receiptCode;
        this.submittedAt = submittedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private Assignment assignment;
        private User student;
        private String status = "SUBMITTED";
        private Integer version = 1;
        private String fileIds = "[]";
        private String receiptCode;
        private Instant submittedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder assignment(Assignment assignment) { this.assignment = assignment; return this; }
        public Builder student(User student) { this.student = student; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder version(Integer version) { this.version = version; return this; }
        public Builder fileIds(String fileIds) { this.fileIds = fileIds; return this; }
        public Builder receiptCode(String receiptCode) { this.receiptCode = receiptCode; return this; }
        public Builder submittedAt(Instant submittedAt) { this.submittedAt = submittedAt; return this; }

        public Submission build() {
            return new Submission(id, assignment, student, status, version, fileIds, receiptCode, submittedAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Assignment getAssignment() { return assignment; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public String getFileIds() { return fileIds; }
    public void setFileIds(String fileIds) { this.fileIds = fileIds; }

    public String getReceiptCode() { return receiptCode; }
    public void setReceiptCode(String receiptCode) { this.receiptCode = receiptCode; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
