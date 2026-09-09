package com.classroom.platform.classrooms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
