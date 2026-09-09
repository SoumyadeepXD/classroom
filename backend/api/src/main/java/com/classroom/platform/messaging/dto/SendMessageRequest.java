package com.classroom.platform.messaging.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class SendMessageRequest {

    @NotBlank(message = "Message content is required")
    private String content;

    private UUID parentMessageId;

    public SendMessageRequest() {}

    public SendMessageRequest(String content, UUID parentMessageId) {
        this.content = content;
        this.parentMessageId = parentMessageId;
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public UUID getParentMessageId() { return parentMessageId; }
    public void setParentMessageId(UUID parentMessageId) { this.parentMessageId = parentMessageId; }
}
