package com.classroom.platform.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    private ErrorBody error;

    public ApiErrorResponse() {}

    public ApiErrorResponse(ErrorBody error) {
        this.error = error;
    }

    public ErrorBody getError() {
        return error;
    }

    public void setError(ErrorBody error) {
        this.error = error;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ErrorBody {
        private String code;
        private String message;
        private List<FieldErrorDetail> details;
        private String timestamp;
        private String requestId;

        public ErrorBody() {}

        public ErrorBody(String code, String message, List<FieldErrorDetail> details, String timestamp, String requestId) {
            this.code = code;
            this.message = message;
            this.details = details;
            this.timestamp = timestamp;
            this.requestId = requestId;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public List<FieldErrorDetail> getDetails() { return details; }
        public void setDetails(List<FieldErrorDetail> details) { this.details = details; }

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

        public String getRequestId() { return requestId; }
        public void setRequestId(String requestId) { this.requestId = requestId; }
    }

    public static class FieldErrorDetail {
        private String field;
        private String issue;

        public FieldErrorDetail() {}

        public FieldErrorDetail(String field, String issue) {
            this.field = field;
            this.issue = issue;
        }

        public String getField() { return field; }
        public void setField(String field) { this.field = field; }

        public String getIssue() { return issue; }
        public void setIssue(String issue) { this.issue = issue; }
    }

    public static ApiErrorResponse of(String code, String message) {
        ErrorBody body = new ErrorBody(code, message, null, Instant.now().toString(), null);
        return new ApiErrorResponse(body);
    }

    public static ApiErrorResponse of(String code, String message, List<FieldErrorDetail> details) {
        ErrorBody body = new ErrorBody(code, message, details, Instant.now().toString(), null);
        return new ApiErrorResponse(body);
    }
}
