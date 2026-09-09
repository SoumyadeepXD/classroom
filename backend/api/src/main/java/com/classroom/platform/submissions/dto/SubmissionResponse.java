package com.classroom.platform.submissions.dto;

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
public class SubmissionResponse {

    private UUID id;
    private UUID assignmentId;
    private UUID studentId;
    private String studentName;
    private String status;
    private Integer version;
    private String fileIds;
    private Instant submittedAt;
    private TurnInReceipt receipt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TurnInReceipt {
        private String receiptCode;
        private String issuedAt;
    }
}
