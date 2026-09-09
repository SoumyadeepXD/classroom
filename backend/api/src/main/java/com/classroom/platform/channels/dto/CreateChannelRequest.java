package com.classroom.platform.channels.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateChannelRequest {

    @NotBlank(message = "Channel name is required")
    @Size(min = 2, max = 100, message = "Channel name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Channel type is required")
    @Pattern(regexp = "TEXT|VOICE|STAGE|ANNOUNCEMENT", message = "Channel type must be TEXT, VOICE, STAGE, or ANNOUNCEMENT")
    private String type;

    private UUID categoryId;
}
