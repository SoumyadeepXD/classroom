package com.classroom.platform.classrooms;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.classroom c WHERE e.user.id = :userId AND c.deletedAt IS NULL ORDER BY e.enrolledAt DESC")
    List<Enrollment> findAllByUserIdWithClassroom(@Param("userId") UUID userId);

    Optional<Enrollment> findByClassroomIdAndUserId(UUID classroomId, UUID userId);

    boolean existsByClassroomIdAndUserId(UUID classroomId, UUID userId);

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.user u WHERE e.classroom.id = :classroomId ORDER BY e.role ASC, u.displayName ASC")
    List<Enrollment> findAllByClassroomIdWithUser(@Param("classroomId") UUID classroomId);
}
