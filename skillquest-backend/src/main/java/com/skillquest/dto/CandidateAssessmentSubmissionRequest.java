package com.skillquest.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.LinkedHashMap;
import java.util.Map;

@Data
public class CandidateAssessmentSubmissionRequest {
    @NotBlank
    private String submissionKey;
    @NotNull
    private Map<String, Object> answers = new LinkedHashMap<>();
    private Integer durationSeconds;
    private Long startedAtEpochMillis;
}
