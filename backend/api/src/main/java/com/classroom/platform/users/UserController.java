package com.classroom.platform.users;

import com.classroom.platform.common.ApiException;
import com.classroom.platform.common.ApiResponse;
import com.classroom.platform.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "User is not authenticated");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"));

        return ResponseEntity.ok(ApiResponse.ok(toMap(user)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "User is not authenticated");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"));

        if (request.containsKey("displayName") && request.get("displayName") != null && !request.get("displayName").trim().isEmpty()) {
            user.setDisplayName(request.get("displayName").trim());
        }

        user = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok(toMap(user)));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Map<String, String>>> changePassword(
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "User is not authenticated");
        }

        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (oldPassword == null || newPassword == null || newPassword.length() < 6) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_PASSWORD", "New password must be at least 6 characters");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INCORRECT_OLD_PASSWORD", "Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "Password updated successfully")));
    }

    private Map<String, Object> toMap(User user) {
        return Map.of(
                "id", user.getId(),
                "institutionId", user.getInstitution() != null ? user.getInstitution().getId() : "",
                "email", user.getEmail(),
                "displayName", user.getDisplayName(),
                "systemRole", user.getSystemRole(),
                "mfaEnabled", user.getMfaEnabled(),
                "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        );
    }
}
