package com.classroom.platform.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private T data;
    private PaginationMeta pagination;
    private Map<String, Object> meta;

    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder()
                .data(data)
                .meta(Map.of("timestamp", Instant.now().toString()))
                .build();
    }

    public static <T> ApiResponse<T> ok(T data, PaginationMeta pagination) {
        return ApiResponse.<T>builder()
                .data(data)
                .pagination(pagination)
                .meta(Map.of("timestamp", Instant.now().toString()))
                .build();
    }
}
