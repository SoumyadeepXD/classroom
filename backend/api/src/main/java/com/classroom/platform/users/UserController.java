package com.classroom.platform.users;

import com.classroom.platform.common.ApiException;
import com.classroom.platform.common.ApiResponse;
import com.classroom.platform.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "User is not authenticated");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"));

        Map<String, Object> userData = Map.of(
                "id", user.getId(),
                "institutionId", user.getInstitution() != null ? user.getInstitution().getId() : null,
                "email", user.getEmail(),
                "displayName", user.getDisplayName(),
                "systemRole", user.getSystemRole(),
                "mfaEnabled", user.getMfaEnabled(),
                "createdAt", user.getCreatedAt().toString()
        );

        return ResponseEntity.ok(ApiResponse.ok(userData));
    }
}
