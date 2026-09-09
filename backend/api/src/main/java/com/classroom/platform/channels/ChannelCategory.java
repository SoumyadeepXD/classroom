package com.classroom.platform.channels;

import com.classroom.platform.classrooms.Classroom;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "channel_categories")
public class ChannelCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer position = 0;

    public ChannelCategory() {}

    public ChannelCategory(UUID id, Classroom classroom, String name, Integer position) {
        this.id = id;
        this.classroom = classroom;
        this.name = name;
        this.position = position != null ? position : 0;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private Classroom classroom;
        private String name;
        private Integer position = 0;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder classroom(Classroom classroom) { this.classroom = classroom; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder position(Integer position) { this.position = position; return this; }

        public ChannelCategory build() {
            return new ChannelCategory(id, classroom, name, position);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Classroom getClassroom() { return classroom; }
    public void setClassroom(Classroom classroom) { this.classroom = classroom; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }
}
