package com.classroom.platform.messaging;

import com.classroom.platform.common.ApiResponse;
import com.classroom.platform.messaging.dto.MessageResponse;
import com.classroom.platform.messaging.dto.SendMessageRequest;
import com.classroom.platform.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/channels/{channelId}/messages")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getChannelMessages(
            @PathVariable("channelId") UUID channelId,
            @RequestParam(name = "limit", defaultValue = "50") int limit,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<MessageResponse> messages = messageService.getChannelMessages(channelId, limit, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @PostMapping("/channels/{channelId}/messages")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @PathVariable("channelId") UUID channelId,
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        MessageResponse message = messageService.sendMessage(channelId, request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(message));
    }

    @GetMapping("/messages/{messageId}/thread")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getThreadReplies(
            @PathVariable("messageId") UUID messageId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<MessageResponse> replies = messageService.getThreadReplies(messageId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(replies));
    }

    @PutMapping("/messages/{messageId}/pin")
    public ResponseEntity<ApiResponse<MessageResponse>> togglePinMessage(
            @PathVariable("messageId") UUID messageId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        MessageResponse response = messageService.togglePinMessage(messageId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
