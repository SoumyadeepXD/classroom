package com.classroom.platform.assignments;

import com.classroom.platform.assignments.dto.AssignmentResponse;
import com.classroom.platform.assignments.dto.CreateAssignmentRequest;
import com.classroom.platform.common.ApiResponse;
import com.classroom.platform.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping("/classrooms/{classroomId}/assignments")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getClassroomAssignments(
            @PathVariable("classroomId") UUID classroomId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<AssignmentResponse> assignments = assignmentService.getClassroomAssignments(classroomId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(assignments));
    }

    @PostMapping("/classrooms/{classroomId}/assignments")
    public ResponseEntity<ApiResponse<AssignmentResponse>> createAssignment(
            @PathVariable("classroomId") UUID classroomId,
            @Valid @RequestBody CreateAssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        AssignmentResponse assignment = assignmentService.createAssignment(classroomId, request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(assignment));
    }

    @GetMapping("/assignments/{assignmentId}")
    public ResponseEntity<ApiResponse<AssignmentResponse>> getAssignment(
            @PathVariable("assignmentId") UUID assignmentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        AssignmentResponse assignment = assignmentService.getAssignmentById(assignmentId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(assignment));
    }
}
