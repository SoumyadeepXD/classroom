package com.classroom.platform.grades;

import com.classroom.platform.common.ApiResponse;
import com.classroom.platform.grades.dto.GradeResponse;
import com.classroom.platform.grades.dto.GradeSubmissionRequest;
import com.classroom.platform.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @PostMapping("/submissions/{submissionId}/grades")
    public ResponseEntity<ApiResponse<GradeResponse>> gradeSubmission(
            @PathVariable("submissionId") UUID submissionId,
            @Valid @RequestBody GradeSubmissionRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        GradeResponse response = gradeService.gradeSubmission(submissionId, request, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/submissions/{submissionId}/grades")
    public ResponseEntity<ApiResponse<GradeResponse>> getSubmissionGrade(
            @PathVariable("submissionId") UUID submissionId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        GradeResponse response = gradeService.getSubmissionGrade(submissionId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/classrooms/{classroomId}/gradebook")
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getClassroomGradebook(
            @PathVariable("classroomId") UUID classroomId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<GradeResponse> gradebook = gradeService.getClassroomGradebook(classroomId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(gradebook));
    }

    @GetMapping("/classrooms/{classroomId}/grades/me")
    public ResponseEntity<ApiResponse<List<java.util.Map<String, Object>>>> getMyClassroomGrades(
            @PathVariable("classroomId") UUID classroomId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<java.util.Map<String, Object>> grades = gradeService.getMyClassroomGrades(classroomId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(grades));
    }
}
