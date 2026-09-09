package com.classroom.platform.classrooms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateClassroomRequest {

    @NotBlank(message = "Course name is required")
    @Size(min = 2, max = 255, message = "Course name must be between 2 and 255 characters")
    private String name;

    @NotBlank(message = "Course code is required")
    @Size(min = 2, max = 50, message = "Course code must be between 2 and 50 characters")
    private String courseCode;

    private String syllabus;
}
