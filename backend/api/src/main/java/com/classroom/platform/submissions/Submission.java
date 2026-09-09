package com.classroom.platform.submissions;

import com.classroom.platform.assignments.Assignment;
import com.classroom.platform.users.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "submissions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"assignment_id", "student_id", "version"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    @Builder.Default
    private String status = "SUBMITTED";

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(name = "file_ids", columnDefinition = "jsonb", nullable = false)
    @Builder.Default
    private String fileIds = "[]";

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
