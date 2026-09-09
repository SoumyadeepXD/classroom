package com.classroom.platform.assignments;

import com.classroom.platform.assignments.dto.AssignmentResponse;
import com.classroom.platform.assignments.dto.CreateAssignmentRequest;
import com.classroom.platform.classrooms.Classroom;
import com.classroom.platform.classrooms.ClassroomRepository;
import com.classroom.platform.classrooms.Enrollment;
import com.classroom.platform.classrooms.EnrollmentRepository;
import com.classroom.platform.common.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final ClassroomRepository classroomRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             ClassroomRepository classroomRepository,
                             EnrollmentRepository enrollmentRepository) {
        this.assignmentRepository = assignmentRepository;
        this.classroomRepository = classroomRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getClassroomAssignments(UUID classroomId, UUID userId) {
        if (!enrollmentRepository.existsByClassroomIdAndUserId(classroomId, userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom");
        }

        return assignmentRepository.findAllByClassroomIdAndDeletedAtIsNullOrderByDueDateAsc(classroomId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(UUID assignmentId, UUID userId) {
        Assignment assignment = assignmentRepository.findByIdAndDeletedAtIsNull(assignmentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ASSIGNMENT_NOT_FOUND", "Assignment not found"));

        if (!enrollmentRepository.existsByClassroomIdAndUserId(assignment.getClassroom().getId(), userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom");
        }

        return toResponse(assignment);
    }

    @Transactional
    public AssignmentResponse createAssignment(UUID classroomId, CreateAssignmentRequest request, UUID userId) {
        Enrollment enrollment = enrollmentRepository.findByClassroomIdAndUserId(classroomId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom"));

        if (!"TEACHER".equals(enrollment.getRole()) && !"TA".equals(enrollment.getRole())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Only teachers or TAs can create assignments");
        }

        Classroom classroom = classroomRepository.findByIdAndDeletedAtIsNull(classroomId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CLASSROOM_NOT_FOUND", "Classroom not found"));

        Assignment assignment = Assignment.builder()
                .classroom(classroom)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .lockDate(request.getLockDate())
                .maxPoints(request.getMaxPoints())
                .rubricData(request.getRubricData() != null ? request.getRubricData() : "[]")
                .build();

        assignment = assignmentRepository.save(assignment);
        return toResponse(assignment);
    }

    private AssignmentResponse toResponse(Assignment assignment) {
        return AssignmentResponse.builder()
                .id(assignment.getId())
                .classroomId(assignment.getClassroom().getId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .dueDate(assignment.getDueDate())
                .lockDate(assignment.getLockDate())
                .maxPoints(assignment.getMaxPoints())
                .rubricData(assignment.getRubricData())
                .createdAt(assignment.getCreatedAt())
                .build();
    }
}
