package com.classroom.platform.channels.dto;

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
public class ChannelResponse {

    private UUID id;
    private UUID classroomId;
    private UUID categoryId;
    private String categoryName;
    private String name;
    private String type;
    private Integer position;
    private Instant createdAt;
}
