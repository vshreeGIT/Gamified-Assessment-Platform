package com.skillquest.dto;

import java.time.LocalDateTime;
import java.util.List;

public record RecruiterAssessmentDto(
        String id,
        String title,
        String description,
        String type,
        String technology,
        String instructions,
        int durationMinutes,
        LocalDateTime startDate,
        LocalDateTime deadline,
        int passingScore,
        int allowedAttempts,
        String status,
        LocalDateTime createdAt,
        int questionCount,
        long assignedCandidates,
        long completedAttempts,
        double averageScore,
        List<String> questionIds,
        List<RecruiterAssessmentQuestionDto> questions) {
}
