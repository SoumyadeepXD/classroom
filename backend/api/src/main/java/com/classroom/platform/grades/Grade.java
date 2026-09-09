package com.classroom.platform.grades;

import com.classroom.platform.submissions.Submission;
import com.classroom.platform.users.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "grades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(name = "rubric_breakdown", columnDefinition = "jsonb", nullable = false)
    @Builder.Default
    private String rubricBreakdown = "{}";

    @Column(name = "private_feedback", columnDefinition = "text")
    private String privateFeedback;

    @Column(nullable = false)
    @Builder.Default
    private Boolean released = false;

    @CreationTimestamp
    @Column(name = "graded_at", nullable = false)
    private Instant gradedAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
