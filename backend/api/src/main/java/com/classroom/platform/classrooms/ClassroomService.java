package com.classroom.platform.classrooms;

import com.classroom.platform.channels.Channel;
import com.classroom.platform.channels.ChannelCategory;
import com.classroom.platform.channels.ChannelCategoryRepository;
import com.classroom.platform.channels.ChannelRepository;
import com.classroom.platform.classrooms.dto.ClassroomResponse;
import com.classroom.platform.classrooms.dto.CreateClassroomRequest;
import com.classroom.platform.classrooms.dto.JoinClassroomRequest;
import com.classroom.platform.common.ApiException;
import com.classroom.platform.users.User;
import com.classroom.platform.users.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClassroomService {

    private static final Logger log = LoggerFactory.getLogger(ClassroomService.class);

    private final ClassroomRepository classroomRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final ChannelCategoryRepository categoryRepository;
    private final ChannelRepository channelRepository;

    public ClassroomService(ClassroomRepository classroomRepository,
                            EnrollmentRepository enrollmentRepository,
                            UserRepository userRepository,
                            ChannelCategoryRepository categoryRepository,
                            ChannelRepository channelRepository) {
        this.classroomRepository = classroomRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.channelRepository = channelRepository;
    }

    private static final String CODE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public ClassroomResponse createClassroom(CreateClassroomRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"));

        String joinCode = generateUniqueJoinCode();

        Classroom classroom = Classroom.builder()
                .institution(user.getInstitution())
                .name(request.getName().trim())
                .courseCode(request.getCourseCode().trim().toUpperCase())
                .joinCode(joinCode)
                .syllabus(request.getSyllabus())
                .archived(false)
                .build();

        classroom = classroomRepository.save(classroom);

        Enrollment teacherEnrollment = Enrollment.builder()
                .classroom(classroom)
                .user(user)
                .role("TEACHER")
                .build();
        enrollmentRepository.save(teacherEnrollment);

        createDefaultChannels(classroom);

        return toResponse(classroom, "TEACHER");
    }

    @Transactional
    public ClassroomResponse joinClassroom(JoinClassroomRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"));

        Classroom classroom = classroomRepository.findByJoinCodeAndDeletedAtIsNull(request.getJoinCode().trim().toUpperCase())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CLASSROOM_NOT_FOUND", "Invalid course join code"));

        if (Boolean.TRUE.equals(classroom.getArchived())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "CLASSROOM_ARCHIVED", "This course is archived and closed for enrollment");
        }

        if (enrollmentRepository.existsByClassroomIdAndUserId(classroom.getId(), user.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "ALREADY_ENROLLED", "You are already enrolled in this classroom");
        }

        Enrollment studentEnrollment = Enrollment.builder()
                .classroom(classroom)
                .user(user)
                .role("STUDENT")
                .build();
        enrollmentRepository.save(studentEnrollment);

        return toResponse(classroom, "STUDENT");
    }

    @Transactional(readOnly = true)
    public List<ClassroomResponse> getUserClassrooms(UUID userId) {
        return enrollmentRepository.findAllByUserIdWithClassroom(userId).stream()
                .map(enrollment -> toResponse(enrollment.getClassroom(), enrollment.getRole()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClassroomResponse getClassroomById(UUID classroomId, UUID userId) {
        Enrollment enrollment = enrollmentRepository.findByClassroomIdAndUserId(classroomId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom"));

        return toResponse(enrollment.getClassroom(), enrollment.getRole());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getClassroomRoster(UUID classroomId, UUID userId) {
        if (!enrollmentRepository.existsByClassroomIdAndUserId(classroomId, userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom");
        }

        return enrollmentRepository.findAllByClassroomIdWithUser(classroomId).stream()
                .map(e -> Map.<String, Object>of(
                        "id", e.getId(),
                        "userId", e.getUser().getId(),
                        "displayName", e.getUser().getDisplayName(),
                        "email", e.getUser().getEmail(),
                        "role", e.getRole(),
                        "enrolledAt", e.getEnrolledAt().toString()
                ))
                .collect(Collectors.toList());
    }

    private void createDefaultChannels(Classroom classroom) {
        ChannelCategory textCategory = categoryRepository.save(ChannelCategory.builder()
                .classroom(classroom)
                .name("TEXT CHANNELS")
                .position(0)
                .build());

        ChannelCategory voiceCategory = categoryRepository.save(ChannelCategory.builder()
                .classroom(classroom)
                .name("VOICE & STAGES")
                .position(1)
                .build());

        channelRepository.save(Channel.builder()
                .classroom(classroom)
                .category(textCategory)
                .name("announcements")
                .type("ANNOUNCEMENT")
                .position(0)
                .build());

        channelRepository.save(Channel.builder()
                .classroom(classroom)
                .category(textCategory)
                .name("general")
                .type("TEXT")
                .position(1)
                .build());

        channelRepository.save(Channel.builder()
                .classroom(classroom)
                .category(voiceCategory)
                .name("lecture-hall")
                .type("STAGE")
                .position(0)
                .build());

        channelRepository.save(Channel.builder()
                .classroom(classroom)
                .category(voiceCategory)
                .name("office-hours")
                .type("VOICE")
                .position(1)
                .build());
    }

    private String generateUniqueJoinCode() {
        for (int i = 0; i < 10; i++) {
            StringBuilder sb = new StringBuilder(7);
            for (int j = 0; j < 7; j++) {
                sb.append(CODE_CHARS.charAt(RANDOM.nextInt(CODE_CHARS.length())));
            }
            String code = sb.toString();
            if (!classroomRepository.existsByJoinCode(code)) {
                return code;
            }
        }
        return UUID.randomUUID().toString().substring(0, 7).toUpperCase();
    }

    private ClassroomResponse toResponse(Classroom classroom, String role) {
        return ClassroomResponse.builder()
                .id(classroom.getId())
                .institutionId(classroom.getInstitution().getId())
                .name(classroom.getName())
                .courseCode(classroom.getCourseCode())
                .joinCode(classroom.getJoinCode())
                .syllabus(classroom.getSyllabus())
                .role(role)
                .archived(classroom.getArchived())
                .createdAt(classroom.getCreatedAt())
                .build();
    }
}
