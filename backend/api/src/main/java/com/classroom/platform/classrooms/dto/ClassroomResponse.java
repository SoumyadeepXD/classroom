package com.classroom.platform.classrooms.dto;

import java.time.Instant;
import java.util.UUID;

public class ClassroomResponse {

    private UUID id;
    private UUID institutionId;
    private String name;
    private String courseCode;
    private String joinCode;
    private String syllabus;
    private String role;
    private Boolean archived;
    private Instant createdAt;

    public ClassroomResponse() {}

    public ClassroomResponse(UUID id, UUID institutionId, String name, String courseCode,
                             String joinCode, String syllabus, String role, Boolean archived, Instant createdAt) {
        this.id = id;
        this.institutionId = institutionId;
        this.name = name;
        this.courseCode = courseCode;
        this.joinCode = joinCode;
        this.syllabus = syllabus;
        this.role = role;
        this.archived = archived;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private UUID institutionId;
        private String name;
        private String courseCode;
        private String joinCode;
        private String syllabus;
        private String role;
        private Boolean archived;
        private Instant createdAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder institutionId(UUID institutionId) { this.institutionId = institutionId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder courseCode(String courseCode) { this.courseCode = courseCode; return this; }
        public Builder joinCode(String joinCode) { this.joinCode = joinCode; return this; }
        public Builder syllabus(String syllabus) { this.syllabus = syllabus; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder archived(Boolean archived) { this.archived = archived; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public ClassroomResponse build() {
            return new ClassroomResponse(id, institutionId, name, courseCode, joinCode, syllabus, role, archived, createdAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getInstitutionId() { return institutionId; }
    public void setInstitutionId(UUID institutionId) { this.institutionId = institutionId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getJoinCode() { return joinCode; }
    public void setJoinCode(String joinCode) { this.joinCode = joinCode; }

    public String getSyllabus() { return syllabus; }
    public void setSyllabus(String syllabus) { this.syllabus = syllabus; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getArchived() { return archived; }
    public void setArchived(Boolean archived) { this.archived = archived; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
