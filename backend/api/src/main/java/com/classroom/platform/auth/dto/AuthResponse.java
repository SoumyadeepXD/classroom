package com.classroom.platform.auth.dto;

import java.util.UUID;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private long expiresIn;
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String refreshToken, long expiresIn, UserDto user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String accessToken;
        private String refreshToken;
        private long expiresIn;
        private UserDto user;

        public Builder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
        public Builder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
        public Builder expiresIn(long expiresIn) { this.expiresIn = expiresIn; return this; }
        public Builder user(UserDto user) { this.user = user; return this; }

        public AuthResponse build() {
            return new AuthResponse(accessToken, refreshToken, expiresIn, user);
        }
    }

    public static class UserDto {
        private UUID id;
        private String email;
        private String displayName;
        private String systemRole;

        public UserDto() {}

        public UserDto(UUID id, String email, String displayName, String systemRole) {
            this.id = id;
            this.email = email;
            this.displayName = displayName;
            this.systemRole = systemRole;
        }

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }

        public String getSystemRole() { return systemRole; }
        public void setSystemRole(String systemRole) { this.systemRole = systemRole; }
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(long expiresIn) { this.expiresIn = expiresIn; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
