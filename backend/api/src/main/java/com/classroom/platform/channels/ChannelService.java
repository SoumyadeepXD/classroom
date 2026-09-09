package com.classroom.platform.channels;

import com.classroom.platform.channels.dto.ChannelResponse;
import com.classroom.platform.channels.dto.CreateChannelRequest;
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
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ChannelCategoryRepository categoryRepository;
    private final ClassroomRepository classroomRepository;
    private final EnrollmentRepository enrollmentRepository;

    public ChannelService(ChannelRepository channelRepository,
                          ChannelCategoryRepository categoryRepository,
                          ClassroomRepository classroomRepository,
                          EnrollmentRepository enrollmentRepository) {
        this.channelRepository = channelRepository;
        this.categoryRepository = categoryRepository;
        this.classroomRepository = classroomRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional(readOnly = true)
    public List<ChannelResponse> getClassroomChannels(UUID classroomId, UUID userId) {
        if (!enrollmentRepository.existsByClassroomIdAndUserId(classroomId, userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom");
        }

        return channelRepository.findAllByClassroomIdOrderByPositionAsc(classroomId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChannelCategory> getClassroomCategories(UUID classroomId, UUID userId) {
        if (!enrollmentRepository.existsByClassroomIdAndUserId(classroomId, userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom");
        }

        return categoryRepository.findAllByClassroomIdOrderByPositionAsc(classroomId);
    }

    @Transactional
    public ChannelResponse createChannel(UUID classroomId, CreateChannelRequest request, UUID userId) {
        Enrollment enrollment = enrollmentRepository.findByClassroomIdAndUserId(classroomId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom"));

        if (!"TEACHER".equals(enrollment.getRole()) && !"TA".equals(enrollment.getRole())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Only teachers or TAs can create channels");
        }

        Classroom classroom = classroomRepository.findByIdAndDeletedAtIsNull(classroomId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CLASSROOM_NOT_FOUND", "Classroom not found"));

        ChannelCategory category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND", "Category not found"));
        }

        Channel channel = Channel.builder()
                .classroom(classroom)
                .category(category)
                .name(request.getName().toLowerCase().replace(" ", "-"))
                .type(request.getType())
                .position(10)
                .build();

        channel = channelRepository.save(channel);
        return toResponse(channel);
    }

    private ChannelResponse toResponse(Channel channel) {
        return ChannelResponse.builder()
                .id(channel.getId())
                .classroomId(channel.getClassroom().getId())
                .categoryId(channel.getCategory() != null ? channel.getCategory().getId() : null)
                .categoryName(channel.getCategory() != null ? channel.getCategory().getName() : null)
                .name(channel.getName())
                .type(channel.getType())
                .position(channel.getPosition())
                .createdAt(channel.getCreatedAt())
                .build();
    }
}
