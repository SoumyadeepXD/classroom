package com.classroom.platform.submissions.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSubmissionRequest {

    private List<String> fileIds;
    private String studentNotes;
}
