package com.classroom.platform.assignments;

import com.classroom.platform.classrooms.Classroom;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    @Builder.Default
    private BigDecimal maxPoints = new BigDecimal("100.00");

    @Column(name = "rubric_data", columnDefinition = "jsonb", nullable = false)
    @Builder.Default
    private String rubricData = "[]";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
