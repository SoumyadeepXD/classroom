package com.classroom.platform.messaging;

import com.classroom.platform.channels.Channel;
import com.classroom.platform.users.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channel_id", nullable = false)
    private Channel channel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    @Column(name = "parent_message_id")
    private UUID parentMessageId;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Column(nullable = false)
    private Boolean pinned = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private String metadata = "{}";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public Message() {}

    public Message(UUID id, Channel channel, User author, UUID parentMessageId, String content,
                   Boolean pinned, String metadata) {
        this.id = id;
        this.channel = channel;
        this.author = author;
        this.parentMessageId = parentMessageId;
        this.content = content;
        this.pinned = pinned != null ? pinned : false;
        this.metadata = metadata != null ? metadata : "{}";
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private Channel channel;
        private User author;
        private UUID parentMessageId;
        private String content;
        private Boolean pinned = false;
        private String metadata = "{}";

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder channel(Channel channel) { this.channel = channel; return this; }
        public Builder author(User author) { this.author = author; return this; }
        public Builder parentMessageId(UUID parentMessageId) { this.parentMessageId = parentMessageId; return this; }
        public Builder content(String content) { this.content = content; return this; }
        public Builder pinned(Boolean pinned) { this.pinned = pinned; return this; }
        public Builder metadata(String metadata) { this.metadata = metadata; return this; }

        public Message build() {
            return new Message(id, channel, author, parentMessageId, content, pinned, metadata);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Channel getChannel() { return channel; }
    public void setChannel(Channel channel) { this.channel = channel; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public UUID getParentMessageId() { return parentMessageId; }
    public void setParentMessageId(UUID parentMessageId) { this.parentMessageId = parentMessageId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Boolean getPinned() { return pinned; }
    public void setPinned(Boolean pinned) { this.pinned = pinned; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }
}
