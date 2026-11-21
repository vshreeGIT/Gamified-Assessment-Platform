package com.skillquest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProvisionRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 120)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "\\d{7,15}", message = "Phone must be 7–15 digits")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    /** Only RECRUITER is accepted through this endpoint. */
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "(?i)RECRUITER", message = "Only RECRUITER accounts may be provisioned through this endpoint")
    private String role;
}
