package com.classroom.platform.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private T data;
    private PaginationMeta pagination;
    private Map<String, Object> meta;

    public ApiResponse() {}

    public ApiResponse(T data, PaginationMeta pagination, Map<String, Object> meta) {
        this.data = data;
        this.pagination = pagination;
        this.meta = meta;
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(data, null, Map.of("timestamp", Instant.now().toString()));
    }

    public static <T> ApiResponse<T> ok(T data, PaginationMeta pagination) {
        return new ApiResponse<>(data, pagination, Map.of("timestamp", Instant.now().toString()));
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public PaginationMeta getPagination() {
        return pagination;
    }

    public void setPagination(PaginationMeta pagination) {
        this.pagination = pagination;
    }

    public Map<String, Object> getMeta() {
        return meta;
    }

    public void setMeta(Map<String, Object> meta) {
        this.meta = meta;
    }
}
