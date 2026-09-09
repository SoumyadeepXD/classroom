package com.classroom.platform.messaging.dto;

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
public class MessageResponse {

    private UUID id;
    private UUID channelId;
    private AuthorDto author;
    private String content;
    private UUID parentMessageId;
    private Boolean pinned;
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorDto {
        private UUID id;
        private String displayName;
        private String email;
    }
}
