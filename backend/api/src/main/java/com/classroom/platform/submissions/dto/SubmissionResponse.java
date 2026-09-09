package com.classroom.platform.submissions.dto;

import java.time.Instant;
import java.util.UUID;

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

    public SubmissionResponse() {}

    public SubmissionResponse(UUID id, UUID assignmentId, UUID studentId, String studentName,
                              String status, Integer version, String fileIds, Instant submittedAt, TurnInReceipt receipt) {
        this.id = id;
        this.assignmentId = assignmentId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.status = status;
        this.version = version;
        this.fileIds = fileIds;
        this.submittedAt = submittedAt;
        this.receipt = receipt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private UUID assignmentId;
        private UUID studentId;
        private String studentName;
        private String status;
        private Integer version;
        private String fileIds;
        private Instant submittedAt;
        private TurnInReceipt receipt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder assignmentId(UUID assignmentId) { this.assignmentId = assignmentId; return this; }
        public Builder studentId(UUID studentId) { this.studentId = studentId; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder version(Integer version) { this.version = version; return this; }
        public Builder fileIds(String fileIds) { this.fileIds = fileIds; return this; }
        public Builder submittedAt(Instant submittedAt) { this.submittedAt = submittedAt; return this; }
        public Builder receipt(TurnInReceipt receipt) { this.receipt = receipt; return this; }

        public SubmissionResponse build() {
            return new SubmissionResponse(id, assignmentId, studentId, studentName, status, version, fileIds, submittedAt, receipt);
        }
    }

    public static class TurnInReceipt {
        private String receiptCode;
        private String issuedAt;

        public TurnInReceipt() {}

        public TurnInReceipt(String receiptCode, String issuedAt) {
            this.receiptCode = receiptCode;
            this.issuedAt = issuedAt;
        }

        public String getReceiptCode() { return receiptCode; }
        public void setReceiptCode(String receiptCode) { this.receiptCode = receiptCode; }

        public String getIssuedAt() { return issuedAt; }
        public void setIssuedAt(String issuedAt) { this.issuedAt = issuedAt; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAssignmentId() { return assignmentId; }
    public void setAssignmentId(UUID assignmentId) { this.assignmentId = assignmentId; }

    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public String getFileIds() { return fileIds; }
    public void setFileIds(String fileIds) { this.fileIds = fileIds; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }

    public TurnInReceipt getReceipt() { return receipt; }
    public void setReceipt(TurnInReceipt receipt) { this.receipt = receipt; }
}
