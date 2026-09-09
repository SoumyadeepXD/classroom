package com.classroom.platform.classrooms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateClassroomRequest {

    @NotBlank(message = "Course name is required")
    @Size(min = 2, max = 255, message = "Course name must be between 2 and 255 characters")
    private String name;

    @NotBlank(message = "Course code is required")
    @Size(min = 2, max = 50, message = "Course code must be between 2 and 50 characters")
    private String courseCode;

    private String syllabus;

    public CreateClassroomRequest() {}

    public CreateClassroomRequest(String name, String courseCode, String syllabus) {
        this.name = name;
        this.courseCode = courseCode;
        this.syllabus = syllabus;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getSyllabus() { return syllabus; }
    public void setSyllabus(String syllabus) { this.syllabus = syllabus; }
}
