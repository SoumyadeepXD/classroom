package com.classroom.platform.classrooms.dto;

import jakarta.validation.constraints.NotBlank;

public class JoinClassroomRequest {

    @NotBlank(message = "Join code is required")
    private String joinCode;

    public JoinClassroomRequest() {}

    public JoinClassroomRequest(String joinCode) {
        this.joinCode = joinCode;
    }

    public String getJoinCode() { return joinCode; }
    public void setJoinCode(String joinCode) { this.joinCode = joinCode; }
}
