package com.classroom.platform.classrooms;

import com.classroom.platform.institutions.Institution;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "classrooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @Column(name = "term_id")
    private UUID termId;

    @Column(nullable = false)
    private String name;

    @Column(name = "course_code", nullable = false, length = 50)
    private String courseCode;

    @Column(name = "join_code", nullable = false, unique = true, length = 16)
    private String joinCode;

    @Column(columnDefinition = "text")
    private String syllabus;

    @Column(nullable = false)
    @Builder.Default
    private Boolean archived = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
