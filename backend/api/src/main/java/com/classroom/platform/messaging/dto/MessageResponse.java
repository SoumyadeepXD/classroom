package com.classroom.platform.messaging.dto;

import java.time.Instant;
import java.util.UUID;

public class MessageResponse {

    private UUID id;
    private UUID channelId;
    private AuthorDto author;
    private String content;
    private UUID parentMessageId;
    private Boolean pinned;
    private Instant createdAt;

    public MessageResponse() {}

    public MessageResponse(UUID id, UUID channelId, AuthorDto author, String content,
                           UUID parentMessageId, Boolean pinned, Instant createdAt) {
        this.id = id;
        this.channelId = channelId;
        this.author = author;
        this.content = content;
        this.parentMessageId = parentMessageId;
        this.pinned = pinned;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private UUID channelId;
        private AuthorDto author;
        private String content;
        private UUID parentMessageId;
        private Boolean pinned = false;
        private Instant createdAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder channelId(UUID channelId) { this.channelId = channelId; return this; }
        public Builder author(AuthorDto author) { this.author = author; return this; }
        public Builder content(String content) { this.content = content; return this; }
        public Builder parentMessageId(UUID parentMessageId) { this.parentMessageId = parentMessageId; return this; }
        public Builder pinned(Boolean pinned) { this.pinned = pinned; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public MessageResponse build() {
            return new MessageResponse(id, channelId, author, content, parentMessageId, pinned, createdAt);
        }
    }

    public static class AuthorDto {
        private UUID id;
        private String displayName;
        private String email;

        public AuthorDto() {}

        public AuthorDto(UUID id, String displayName, String email) {
            this.id = id;
            this.displayName = displayName;
            this.email = email;
        }

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getChannelId() { return channelId; }
    public void setChannelId(UUID channelId) { this.channelId = channelId; }

    public AuthorDto getAuthor() { return author; }
    public void setAuthor(AuthorDto author) { this.author = author; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public UUID getParentMessageId() { return parentMessageId; }
    public void setParentMessageId(UUID parentMessageId) { this.parentMessageId = parentMessageId; }

    public Boolean getPinned() { return pinned; }
    public void setPinned(Boolean pinned) { this.pinned = pinned; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
