package com.classroom.platform.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    private ErrorBody error;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ErrorBody {
        private String code;
        private String message;
        private List<FieldErrorDetail> details;
        private String timestamp;
        private String requestId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FieldErrorDetail {
        private String field;
        private String issue;
    }

    public static ApiErrorResponse of(String code, String message) {
        return ApiErrorResponse.builder()
                .error(ErrorBody.builder()
                        .code(code)
                        .message(message)
                        .timestamp(Instant.now().toString())
                        .build())
                .build();
    }

    public static ApiErrorResponse of(String code, String message, List<FieldErrorDetail> details) {
        return ApiErrorResponse.builder()
                .error(ErrorBody.builder()
                        .code(code)
                        .message(message)
                        .details(details)
                        .timestamp(Instant.now().toString())
                        .build())
                .build();
    }
}
