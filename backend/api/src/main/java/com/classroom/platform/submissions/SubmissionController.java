package com.classroom.platform.submissions;

import com.classroom.platform.common.ApiResponse;
import com.classroom.platform.security.UserPrincipal;
import com.classroom.platform.submissions.dto.CreateSubmissionRequest;
import com.classroom.platform.submissions.dto.SubmissionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assignments/{assignmentId}/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubmissionResponse>> submitWork(
            @PathVariable("assignmentId") UUID assignmentId,
            @RequestBody CreateSubmissionRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        SubmissionResponse response = submissionService.submitWork(assignmentId, request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getMySubmission(
            @PathVariable("assignmentId") UUID assignmentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        SubmissionResponse response = submissionService.getMySubmission(assignmentId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getAssignmentSubmissions(
            @PathVariable("assignmentId") UUID assignmentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<SubmissionResponse> responses = submissionService.getAssignmentSubmissions(assignmentId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }
}
