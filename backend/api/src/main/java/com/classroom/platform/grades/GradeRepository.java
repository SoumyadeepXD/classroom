package com.classroom.platform.grades;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GradeRepository extends JpaRepository<Grade, UUID> {
    Optional<Grade> findBySubmissionId(UUID submissionId);

    @Query("SELECT g FROM Grade g JOIN FETCH g.submission s WHERE s.assignment.classroom.id = :classroomId")
    List<Grade> findAllByClassroomId(@Param("classroomId") UUID classroomId);
}
