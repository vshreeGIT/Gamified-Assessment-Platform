package com.skillquest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RecruiterAssignmentRequest {
    @NotBlank @Email
    private String email;
}
