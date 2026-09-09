package com.classroom.platform.channels.dto;

import java.time.Instant;
import java.util.UUID;

public class ChannelResponse {

    private UUID id;
    private UUID classroomId;
    private UUID categoryId;
    private String categoryName;
    private String name;
    private String type;
    private Integer position;
    private Instant createdAt;

    public ChannelResponse() {}

    public ChannelResponse(UUID id, UUID classroomId, UUID categoryId, String categoryName,
                           String name, String type, Integer position, Instant createdAt) {
        this.id = id;
        this.classroomId = classroomId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.name = name;
        this.type = type;
        this.position = position;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private UUID classroomId;
        private UUID categoryId;
        private String categoryName;
        private String name;
        private String type;
        private Integer position;
        private Instant createdAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder classroomId(UUID classroomId) { this.classroomId = classroomId; return this; }
        public Builder categoryId(UUID categoryId) { this.categoryId = categoryId; return this; }
        public Builder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder position(Integer position) { this.position = position; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public ChannelResponse build() {
            return new ChannelResponse(id, classroomId, categoryId, categoryName, name, type, position, createdAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getClassroomId() { return classroomId; }
    public void setClassroomId(UUID classroomId) { this.classroomId = classroomId; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
