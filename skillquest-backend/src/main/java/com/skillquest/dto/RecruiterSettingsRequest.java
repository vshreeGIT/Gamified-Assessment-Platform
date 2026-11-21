package com.skillquest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RecruiterSettingsRequest {
    @NotBlank @Size(max = 120)
    private String name;
    @NotBlank @Email
    private String email;
    private boolean notificationsEnabled = true;
}
