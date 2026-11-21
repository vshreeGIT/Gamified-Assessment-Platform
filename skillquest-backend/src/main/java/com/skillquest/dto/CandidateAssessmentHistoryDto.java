package com.skillquest.dto;

import java.time.Instant;

public record CandidateAssessmentHistoryDto(
        String assessmentName,
        String technology,
        Integer score,
        Instant completedAt) {
}