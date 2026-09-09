package com.classroom.platform.grades;

import com.classroom.platform.submissions.Submission;
import com.classroom.platform.users.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false, unique = true)
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by_user_id", nullable = false)
    private User gradedByUser;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal score;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "rubric_breakdown", columnDefinition = "jsonb", nullable = false)
    private String rubricBreakdown = "{}";

    @Column(name = "private_feedback", columnDefinition = "text")
    private String privateFeedback;

    @Column(nullable = false)
    private Boolean released = false;

    @CreationTimestamp
    @Column(name = "graded_at", nullable = false)
    private Instant gradedAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Grade() {}

    public Grade(UUID id, Submission submission, User gradedByUser, BigDecimal score,
                 String rubricBreakdown, String privateFeedback, Boolean released) {
        this.id = id;
        this.submission = submission;
        this.gradedByUser = gradedByUser;
        this.score = score;
        this.rubricBreakdown = rubricBreakdown != null ? rubricBreakdown : "{}";
        this.privateFeedback = privateFeedback;
        this.released = released != null ? released : false;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private Submission submission;
        private User gradedByUser;
        private BigDecimal score;
        private String rubricBreakdown = "{}";
        private String privateFeedback;
        private Boolean released = false;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder submission(Submission submission) { this.submission = submission; return this; }
        public Builder gradedByUser(User gradedByUser) { this.gradedByUser = gradedByUser; return this; }
        public Builder score(BigDecimal score) { this.score = score; return this; }
        public Builder rubricBreakdown(String rubricBreakdown) { this.rubricBreakdown = rubricBreakdown; return this; }
        public Builder privateFeedback(String privateFeedback) { this.privateFeedback = privateFeedback; return this; }
        public Builder released(Boolean released) { this.released = released; return this; }

        public Grade build() {
            return new Grade(id, submission, gradedByUser, score, rubricBreakdown, privateFeedback, released);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Submission getSubmission() { return submission; }
    public void setSubmission(Submission submission) { this.submission = submission; }

    public User getGradedByUser() { return gradedByUser; }
    public void setGradedByUser(User gradedByUser) { this.gradedByUser = gradedByUser; }

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

    public Instant getUpdatedAt() { return updatedAt; }
}
