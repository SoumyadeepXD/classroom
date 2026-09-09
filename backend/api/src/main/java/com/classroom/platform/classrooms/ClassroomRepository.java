package com.classroom.platform.classrooms;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {
    Optional<Classroom> findByJoinCodeAndDeletedAtIsNull(String joinCode);
    Optional<Classroom> findByIdAndDeletedAtIsNull(UUID id);
    boolean existsByJoinCode(String joinCode);
}
