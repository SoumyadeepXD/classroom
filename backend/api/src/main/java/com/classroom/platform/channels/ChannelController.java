package com.classroom.platform.channels;

import com.classroom.platform.channels.dto.ChannelResponse;
import com.classroom.platform.channels.dto.CreateChannelRequest;
import com.classroom.platform.common.ApiResponse;
import com.classroom.platform.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classrooms/{classroomId}/channels")
@RequiredArgsConstructor
public class ChannelController {

    private final ChannelService channelService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChannelResponse>>> getClassroomChannels(
            @PathVariable("classroomId") UUID classroomId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ChannelResponse> channels = channelService.getClassroomChannels(classroomId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(channels));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChannelResponse>> createChannel(
            @PathVariable("classroomId") UUID classroomId,
            @Valid @RequestBody CreateChannelRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ChannelResponse channel = channelService.createChannel(classroomId, request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(channel));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<ChannelCategory>>> getCategories(
            @PathVariable("classroomId") UUID classroomId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ChannelCategory> categories = channelService.getClassroomCategories(classroomId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }
}
