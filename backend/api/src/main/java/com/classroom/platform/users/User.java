package com.classroom.platform.users;

import com.classroom.platform.institutions.Institution;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Column(name = "avatar_file_id")
    private UUID avatarFileId;

    @Column(name = "system_role", nullable = false, length = 50)
    private String systemRole = "USER";

    @Column(name = "mfa_enabled", nullable = false)
    private Boolean mfaEnabled = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public User() {}

    public User(UUID id, Institution institution, String email, String passwordHash, String displayName,
                UUID avatarFileId, String systemRole, Boolean mfaEnabled) {
        this.id = id;
        this.institution = institution;
        this.email = email;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
        this.avatarFileId = avatarFileId;
        this.systemRole = systemRole != null ? systemRole : "USER";
        this.mfaEnabled = mfaEnabled != null ? mfaEnabled : false;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private Institution institution;
        private String email;
        private String passwordHash;
        private String displayName;
        private UUID avatarFileId;
        private String systemRole = "USER";
        private Boolean mfaEnabled = false;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder institution(Institution institution) { this.institution = institution; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public Builder displayName(String displayName) { this.displayName = displayName; return this; }
        public Builder avatarFileId(UUID avatarFileId) { this.avatarFileId = avatarFileId; return this; }
        public Builder systemRole(String systemRole) { this.systemRole = systemRole; return this; }
        public Builder mfaEnabled(Boolean mfaEnabled) { this.mfaEnabled = mfaEnabled; return this; }

        public User build() {
            return new User(id, institution, email, passwordHash, displayName, avatarFileId, systemRole, mfaEnabled);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Institution getInstitution() { return institution; }
    public void setInstitution(Institution institution) { this.institution = institution; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public UUID getAvatarFileId() { return avatarFileId; }
    public void setAvatarFileId(UUID avatarFileId) { this.avatarFileId = avatarFileId; }

    public String getSystemRole() { return systemRole; }
    public void setSystemRole(String systemRole) { this.systemRole = systemRole; }

    public Boolean getMfaEnabled() { return mfaEnabled; }
    public void setMfaEnabled(Boolean mfaEnabled) { this.mfaEnabled = mfaEnabled; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }
}
