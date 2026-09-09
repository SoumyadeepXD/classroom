package com.classroom.platform.channels.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public class CreateChannelRequest {

    @NotBlank(message = "Channel name is required")
    @Size(min = 2, max = 100, message = "Channel name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Channel type is required")
    @Pattern(regexp = "TEXT|VOICE|STAGE|ANNOUNCEMENT", message = "Channel type must be TEXT, VOICE, STAGE, or ANNOUNCEMENT")
    private String type;

    private UUID categoryId;

    public CreateChannelRequest() {}

    public CreateChannelRequest(String name, String type, UUID categoryId) {
        this.name = name;
        this.type = type;
        this.categoryId = categoryId;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
}
