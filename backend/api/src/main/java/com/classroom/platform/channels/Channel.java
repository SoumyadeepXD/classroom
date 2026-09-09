package com.classroom.platform.channels;

import com.classroom.platform.classrooms.Classroom;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "channels")
public class Channel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ChannelCategory category;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 30)
    private String type = "TEXT";

    @Column(nullable = false)
    private Integer position = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Channel() {}

    public Channel(UUID id, Classroom classroom, ChannelCategory category, String name, String type, Integer position) {
        this.id = id;
        this.classroom = classroom;
        this.category = category;
        this.name = name;
        this.type = type != null ? type : "TEXT";
        this.position = position != null ? position : 0;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private Classroom classroom;
        private ChannelCategory category;
        private String name;
        private String type = "TEXT";
        private Integer position = 0;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder classroom(Classroom classroom) { this.classroom = classroom; return this; }
        public Builder category(ChannelCategory category) { this.category = category; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder position(Integer position) { this.position = position; return this; }

        public Channel build() {
            return new Channel(id, classroom, category, name, type, position);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Classroom getClassroom() { return classroom; }
    public void setClassroom(Classroom classroom) { this.classroom = classroom; }

    public ChannelCategory getCategory() { return category; }
    public void setCategory(ChannelCategory category) { this.category = category; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    public Instant getCreatedAt() { return createdAt; }
}
