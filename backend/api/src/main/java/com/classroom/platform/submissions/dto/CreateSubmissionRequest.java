package com.classroom.platform.submissions.dto;

import java.util.List;

public class CreateSubmissionRequest {

    private List<String> fileIds;
    private String studentNotes;

    public CreateSubmissionRequest() {}

    public CreateSubmissionRequest(List<String> fileIds, String studentNotes) {
        this.fileIds = fileIds;
        this.studentNotes = studentNotes;
    }

    public List<String> getFileIds() { return fileIds; }
    public void setFileIds(List<String> fileIds) { this.fileIds = fileIds; }

    public String getStudentNotes() { return studentNotes; }
    public void setStudentNotes(String studentNotes) { this.studentNotes = studentNotes; }
}
