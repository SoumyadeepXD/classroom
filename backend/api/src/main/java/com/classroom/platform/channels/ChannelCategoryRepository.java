package com.classroom.platform.channels;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChannelCategoryRepository extends JpaRepository<ChannelCategory, UUID> {
    List<ChannelCategory> findAllByClassroomIdOrderByPositionAsc(UUID classroomId);
}
