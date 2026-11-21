package com.skillquest.dto;

import java.time.LocalDateTime;

public record RecruiterAssessmentResultDto(
        String id,
        String attemptId,
        String candidateId,
        String candidateName,
        String assessmentId,
        String assessmentName,
        String technology,
        Integer score,
        Integer percentage,
        Integer passedTests,
        Integer totalTests,
        Integer durationSeconds,
        String status,
        Integer rank,
        String decision,
        LocalDateTime completedAt) {
}
