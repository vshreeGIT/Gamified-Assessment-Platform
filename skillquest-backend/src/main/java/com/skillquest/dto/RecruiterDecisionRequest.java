package com.skillquest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RecruiterDecisionRequest {
    @NotBlank @Pattern(regexp = "shortlisted|review|rejected")
    private String decision;
    @Size(max = 4000)
    private String notes;
}
