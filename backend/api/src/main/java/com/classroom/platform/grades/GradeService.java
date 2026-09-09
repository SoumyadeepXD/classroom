package com.classroom.platform.grades;

import com.classroom.platform.classrooms.Enrollment;
import com.classroom.platform.classrooms.EnrollmentRepository;
import com.classroom.platform.common.ApiException;
import com.classroom.platform.grades.dto.GradeResponse;
import com.classroom.platform.grades.dto.GradeSubmissionRequest;
import com.classroom.platform.submissions.Submission;
import com.classroom.platform.submissions.SubmissionRepository;
import com.classroom.platform.users.User;
import com.classroom.platform.users.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GradeService {

    private final GradeRepository gradeRepository;
    private final SubmissionRepository submissionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public GradeService(GradeRepository gradeRepository,
                        SubmissionRepository submissionRepository,
                        EnrollmentRepository enrollmentRepository,
                        UserRepository userRepository) {
        this.gradeRepository = gradeRepository;
        this.submissionRepository = submissionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public GradeResponse gradeSubmission(UUID submissionId, GradeSubmissionRequest request, UUID userId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SUBMISSION_NOT_FOUND", "Submission not found"));

        UUID classroomId = submission.getAssignment().getClassroom().getId();
        Enrollment enrollment = enrollmentRepository.findByClassroomIdAndUserId(classroomId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom"));

        if (!"TEACHER".equals(enrollment.getRole()) && !"TA".equals(enrollment.getRole())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Only teachers or TAs can grade submissions");
        }

        User grader = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"));

        Grade grade = gradeRepository.findBySubmissionId(submissionId)
                .orElse(Grade.builder()
                        .submission(submission)
                        .gradedByUser(grader)
                        .build());

        grade.setScore(request.getTotalScore());
        grade.setPrivateFeedback(request.getPrivateFeedback());
        grade.setRubricBreakdown(request.getRubricBreakdown() != null ? request.getRubricBreakdown() : "{}");
        grade.setReleased(Boolean.TRUE.equals(request.getReleaseImmediately()));

        grade = gradeRepository.save(grade);

        submission.setStatus("GRADED");
        submissionRepository.save(submission);

        return toResponse(grade);
    }

    @Transactional(readOnly = true)
    public GradeResponse getSubmissionGrade(UUID submissionId, UUID userId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SUBMISSION_NOT_FOUND", "Submission not found"));

        Grade grade = gradeRepository.findBySubmissionId(submissionId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "GRADE_NOT_FOUND", "Submission has not been graded yet"));

        boolean isAuthor = submission.getStudent().getId().equals(userId);
        if (isAuthor && !Boolean.TRUE.equals(grade.getReleased())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "GRADE_NOT_RELEASED", "Grades have not been released by the instructor yet");
        }

        return toResponse(grade);
    }

    @Transactional(readOnly = true)
    public List<GradeResponse> getClassroomGradebook(UUID classroomId, UUID userId) {
        Enrollment enrollment = enrollmentRepository.findByClassroomIdAndUserId(classroomId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom"));

        if (!"TEACHER".equals(enrollment.getRole()) && !"TA".equals(enrollment.getRole())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Only teachers or TAs can view the complete gradebook");
        }

        return gradeRepository.findAllByClassroomId(classroomId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private GradeResponse toResponse(Grade grade) {
        return GradeResponse.builder()
                .id(grade.getId())
                .submissionId(grade.getSubmission().getId())
                .gradedByUserId(grade.getGradedByUser().getId())
                .score(grade.getScore())
                .rubricBreakdown(grade.getRubricBreakdown())
                .privateFeedback(grade.getPrivateFeedback())
                .released(grade.getReleased())
                .gradedAt(grade.getGradedAt())
                .build();
    }
}
