package com.classroom.platform.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String institutionSlug;

    public LoginRequest() {}

    public LoginRequest(String email, String password, String institutionSlug) {
        this.email = email;
        this.password = password;
        this.institutionSlug = institutionSlug;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getInstitutionSlug() { return institutionSlug; }
    public void setInstitutionSlug(String institutionSlug) { this.institutionSlug = institutionSlug; }
}
