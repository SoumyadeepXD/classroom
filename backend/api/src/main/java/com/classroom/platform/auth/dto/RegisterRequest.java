package com.classroom.platform.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Display name is required")
    @Size(min = 2, max = 100, message = "Display name must be between 2 and 100 characters")
    private String displayName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    private String institutionSlug;

    public RegisterRequest() {}

    public RegisterRequest(String displayName, String email, String password, String institutionSlug) {
        this.displayName = displayName;
        this.email = email;
        this.password = password;
        this.institutionSlug = institutionSlug;
    }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getInstitutionSlug() { return institutionSlug; }
    public void setInstitutionSlug(String institutionSlug) { this.institutionSlug = institutionSlug; }
}
