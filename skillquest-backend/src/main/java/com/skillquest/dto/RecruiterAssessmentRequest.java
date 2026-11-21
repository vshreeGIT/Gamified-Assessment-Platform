package com.skillquest.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.Valid;
import lombok.Data;

import java.util.List;

@Data
public class RecruiterAssessmentRequest {
    @NotBlank @Size(max = 120)
    private String title;
    @NotBlank @Size(max = 5000)
    private String description;
    @NotBlank @Pattern(regexp = "(?i)coding|aptitude|skill")
    private String type;
    @NotBlank @Size(max = 80)
    private String technology;
    @Size(max = 5000)
    private String instructions;
    @Min(1) @Max(600)
    private int durationMinutes = 45;
    @Size(max = 40)
    private String startDate;
    @Size(max = 40)
    private String deadline;
    @Min(0) @Max(100)
    private int passingScore = 70;
    @Min(1) @Max(5)
    private int allowedAttempts = 1;
    @Pattern(regexp = "(?i)draft|published|closed")
    private String status = "draft";
    @Size(max = 100)
    private List<@NotBlank @Size(max = 120) String> questionIds;
    @Valid
    @Size(max = 100)
    private List<RecruiterAssessmentQuestionRequest> questions;
}
