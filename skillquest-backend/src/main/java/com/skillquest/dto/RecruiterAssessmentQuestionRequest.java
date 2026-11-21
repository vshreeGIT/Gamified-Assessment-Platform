package com.skillquest.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RecruiterAssessmentQuestionRequest {
    @Size(max = 80)
    private String id;

    @NotBlank
    @Pattern(regexp = "(?i)MCQ|MULTIPLE_SELECT|SHORT_ANSWER")
    private String type = "MCQ";

    @NotBlank
    @Size(max = 2000)
    private String prompt;

    @Size(max = 20)
    private List<@NotBlank @Size(max = 500) String> options = new ArrayList<>();

    @Size(max = 20)
    private List<@NotBlank @Size(max = 500) String> correctAnswers = new ArrayList<>();

    @Min(1)
    @Max(1000)
    private int marks = 1;
}