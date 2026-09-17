package com.classroom.platform.submissions;

import com.classroom.platform.assignments.Assignment;
import com.classroom.platform.assignments.AssignmentRepository;
import com.classroom.platform.classrooms.Enrollment;
import com.classroom.platform.classrooms.EnrollmentRepository;
import com.classroom.platform.common.ApiException;
import com.classroom.platform.submissions.dto.CreateSubmissionRequest;
import com.classroom.platform.submissions.dto.SubmissionResponse;
import com.classroom.platform.users.User;
import com.classroom.platform.users.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SubmissionService(SubmissionRepository submissionRepository,
                             AssignmentRepository assignmentRepository,
                             EnrollmentRepository enrollmentRepository,
                             UserRepository userRepository) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SubmissionResponse submitWork(UUID assignmentId, CreateSubmissionRequest request, UUID userId) {
        Assignment assignment = assignmentRepository.findByIdAndDeletedAtIsNull(assignmentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ASSIGNMENT_NOT_FOUND", "Assignment not found"));

        if (!enrollmentRepository.existsByClassroomIdAndUserId(assignment.getClassroom().getId(), userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom");
        }

        if (assignment.getLockDate() != null && Instant.now().isAfter(assignment.getLockDate())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "SUBMISSIONS_CLOSED", "Submissions for this assignment are closed");
        }

        User student = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"));

        Optional<Submission> latestSubmission = submissionRepository.findTopByAssignmentIdAndStudentIdOrderByVersionDesc(assignmentId, userId);
        int nextVersion = latestSubmission.map(s -> s.getVersion() + 1).orElse(1);

        String filesJson = "[]";
        try {
            if (request.getFileIds() != null) {
                filesJson = objectMapper.writeValueAsString(request.getFileIds());
            }
        } catch (Exception ignored) {}

        String status = (assignment.getDueDate() != null && Instant.now().isAfter(assignment.getDueDate())) ? "LATE" : "SUBMITTED";
        String receiptCode = "RCPT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Submission submission = Submission.builder()
                .assignment(assignment)
                .student(student)
                .status(status)
                .version(nextVersion)
                .fileIds(filesJson)
                .receiptCode(receiptCode)
                .submittedAt(Instant.now())
                .build();

        submission = submissionRepository.save(submission);
        return toResponse(submission);
    }

    @Transactional(readOnly = true)
    public SubmissionResponse getMySubmission(UUID assignmentId, UUID userId) {
        return submissionRepository.findTopByAssignmentIdAndStudentIdOrderByVersionDesc(assignmentId, userId)
                .map(this::toResponse)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getAssignmentSubmissions(UUID assignmentId, UUID userId) {
        Assignment assignment = assignmentRepository.findByIdAndDeletedAtIsNull(assignmentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ASSIGNMENT_NOT_FOUND", "Assignment not found"));

        Enrollment enrollment = enrollmentRepository.findByClassroomIdAndUserId(assignment.getClassroom().getId(), userId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom"));

        if (!"TEACHER".equals(enrollment.getRole()) && !"TA".equals(enrollment.getRole())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Only teachers or TAs can view all submissions");
        }

        return submissionRepository.findAllByAssignmentIdWithStudent(assignmentId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private SubmissionResponse toResponse(Submission submission) {
        String receiptCode = submission.getReceiptCode() != null
                ? submission.getReceiptCode()
                : "RCPT-" + submission.getId().toString().substring(0, 8).toUpperCase();

        return SubmissionResponse.builder()
                .id(submission.getId())
                .assignmentId(submission.getAssignment().getId())
                .studentId(submission.getStudent().getId())
                .studentName(submission.getStudent().getDisplayName())
                .status(submission.getStatus())
                .version(submission.getVersion())
                .fileIds(submission.getFileIds())
                .submittedAt(submission.getSubmittedAt())
                .receipt(new SubmissionResponse.TurnInReceipt(receiptCode, submission.getSubmittedAt().toString()))
                .build();
    }
}
