package com.classroom.platform.messaging;

import com.classroom.platform.channels.Channel;
import com.classroom.platform.channels.ChannelRepository;
import com.classroom.platform.classrooms.EnrollmentRepository;
import com.classroom.platform.common.ApiException;
import com.classroom.platform.messaging.dto.MessageResponse;
import com.classroom.platform.messaging.dto.SendMessageRequest;
import com.classroom.platform.users.User;
import com.classroom.platform.users.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private static final Logger log = LoggerFactory.getLogger(MessageService.class);

    private final MessageRepository messageRepository;
    private final ChannelRepository channelRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageService(MessageRepository messageRepository,
                          ChannelRepository channelRepository,
                          EnrollmentRepository enrollmentRepository,
                          UserRepository userRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.messageRepository = messageRepository;
        this.channelRepository = channelRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public MessageResponse sendMessage(UUID channelId, SendMessageRequest request, UUID userId) {
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CHANNEL_NOT_FOUND", "Channel not found"));

        if (!enrollmentRepository.existsByClassroomIdAndUserId(channel.getClassroom().getId(), userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"));

        Message message = Message.builder()
                .channel(channel)
                .author(user)
                .parentMessageId(request.getParentMessageId())
                .content(request.getContent().trim())
                .pinned(false)
                .metadata("{}")
                .build();

        message = messageRepository.save(message);

        MessageResponse response = toResponse(message);

        try {
            messagingTemplate.convertAndSend(
                    "/topic/channels." + channelId,
                    Map.of("eventType", "MESSAGE_CREATED", "data", response)
            );
        } catch (Exception e) {
            log.warn("Failed to broadcast WebSocket message: {}", e.getMessage());
        }

        return response;
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getChannelMessages(UUID channelId, int limit, UUID userId) {
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CHANNEL_NOT_FOUND", "Channel not found"));

        if (!enrollmentRepository.existsByClassroomIdAndUserId(channel.getClassroom().getId(), userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom");
        }

        int size = Math.min(Math.max(limit, 1), 100);
        return messageRepository.findAllByChannelIdWithAuthor(channelId, PageRequest.of(0, size)).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getThreadReplies(UUID messageId, UUID userId) {
        Message parent = messageRepository.findById(messageId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MESSAGE_NOT_FOUND", "Parent message not found"));

        if (!enrollmentRepository.existsByClassroomIdAndUserId(parent.getChannel().getClassroom().getId(), userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not enrolled in this classroom");
        }

        return messageRepository.findAllByParentMessageIdWithAuthor(messageId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private MessageResponse toResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .channelId(message.getChannel().getId())
                .author(new MessageResponse.AuthorDto(
                        message.getAuthor().getId(),
                        message.getAuthor().getDisplayName(),
                        message.getAuthor().getEmail()))
                .content(message.getContent())
                .parentMessageId(message.getParentMessageId())
                .pinned(message.getPinned())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
