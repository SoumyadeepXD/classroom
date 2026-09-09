package com.classroom.platform.classrooms;

import com.classroom.platform.institutions.Institution;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "classrooms")
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
    private Boolean archived = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public Classroom() {}

    public Classroom(UUID id, Institution institution, UUID termId, String name, String courseCode,
                     String joinCode, String syllabus, Boolean archived) {
        this.id = id;
        this.institution = institution;
        this.termId = termId;
        this.name = name;
        this.courseCode = courseCode;
        this.joinCode = joinCode;
        this.syllabus = syllabus;
        this.archived = archived != null ? archived : false;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private Institution institution;
        private UUID termId;
        private String name;
        private String courseCode;
        private String joinCode;
        private String syllabus;
        private Boolean archived = false;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder institution(Institution institution) { this.institution = institution; return this; }
        public Builder termId(UUID termId) { this.termId = termId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder courseCode(String courseCode) { this.courseCode = courseCode; return this; }
        public Builder joinCode(String joinCode) { this.joinCode = joinCode; return this; }
        public Builder syllabus(String syllabus) { this.syllabus = syllabus; return this; }
        public Builder archived(Boolean archived) { this.archived = archived; return this; }

        public Classroom build() {
            return new Classroom(id, institution, termId, name, courseCode, joinCode, syllabus, archived);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Institution getInstitution() { return institution; }
    public void setInstitution(Institution institution) { this.institution = institution; }

    public UUID getTermId() { return termId; }
    public void setTermId(UUID termId) { this.termId = termId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getJoinCode() { return joinCode; }
    public void setJoinCode(String joinCode) { this.joinCode = joinCode; }

    public String getSyllabus() { return syllabus; }
    public void setSyllabus(String syllabus) { this.syllabus = syllabus; }

    public Boolean getArchived() { return archived; }
    public void setArchived(Boolean archived) { this.archived = archived; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }
}
