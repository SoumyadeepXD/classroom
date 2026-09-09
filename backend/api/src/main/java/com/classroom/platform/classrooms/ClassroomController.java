package com.classroom.platform.classrooms;

import com.classroom.platform.classrooms.dto.ClassroomResponse;
import com.classroom.platform.classrooms.dto.CreateClassroomRequest;
import com.classroom.platform.classrooms.dto.JoinClassroomRequest;
import com.classroom.platform.common.ApiResponse;
import com.classroom.platform.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classrooms")
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomService classroomService;

    @PostMapping
    public ResponseEntity<ApiResponse<ClassroomResponse>> createClassroom(
            @Valid @RequestBody CreateClassroomRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ClassroomResponse response = classroomService.createClassroom(request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @PostMapping("/join")
    public ResponseEntity<ApiResponse<ClassroomResponse>> joinClassroom(
            @Valid @RequestBody JoinClassroomRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ClassroomResponse response = classroomService.joinClassroom(request, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClassroomResponse>>> getUserClassrooms(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ClassroomResponse> classrooms = classroomService.getUserClassrooms(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(classrooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassroomResponse>> getClassroom(
            @PathVariable("id") UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ClassroomResponse response = classroomService.getClassroomById(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}/roster")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getClassroomRoster(
            @PathVariable("id") UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<Map<String, Object>> roster = classroomService.getClassroomRoster(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(roster));
    }
}
