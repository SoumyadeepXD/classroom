package com.classroom.platform.classrooms;

import com.classroom.platform.users.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "enrollments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"classroom_id", "user_id"})
})
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 30)
    private String role = "STUDENT";

    @CreationTimestamp
    @Column(name = "enrolled_at", nullable = false, updatable = false)
    private Instant enrolledAt;

    public Enrollment() {}

    public Enrollment(UUID id, Classroom classroom, User user, String role) {
        this.id = id;
        this.classroom = classroom;
        this.user = user;
        this.role = role != null ? role : "STUDENT";
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private Classroom classroom;
        private User user;
        private String role = "STUDENT";

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder classroom(Classroom classroom) { this.classroom = classroom; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder role(String role) { this.role = role; return this; }

        public Enrollment build() {
            return new Enrollment(id, classroom, user, role);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Classroom getClassroom() { return classroom; }
    public void setClassroom(Classroom classroom) { this.classroom = classroom; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Instant getEnrolledAt() { return enrolledAt; }
}
