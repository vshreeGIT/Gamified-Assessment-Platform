package com.skillquest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class JobApplicationStatusRequest {
    @NotBlank
    @Pattern(regexp = "(?i)APPLIED|IN_REVIEW|SHORTLISTED|REJECTED")
    private String status;
}