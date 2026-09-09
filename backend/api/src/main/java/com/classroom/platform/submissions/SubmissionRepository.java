package com.classroom.platform.submissions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    @Query("SELECT s FROM Submission s JOIN FETCH s.student u WHERE s.assignment.id = :assignmentId ORDER BY s.submittedAt DESC")
    List<Submission> findAllByAssignmentIdWithStudent(@Param("assignmentId") UUID assignmentId);

    Optional<Submission> findTopByAssignmentIdAndStudentIdOrderByVersionDesc(UUID assignmentId, UUID studentId);

    List<Submission> findAllByAssignmentIdAndStudentIdOrderByVersionDesc(UUID assignmentId, UUID studentId);
}
