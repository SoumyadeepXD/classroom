package com.classroom.platform.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginationMeta {

    private int page;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
}
