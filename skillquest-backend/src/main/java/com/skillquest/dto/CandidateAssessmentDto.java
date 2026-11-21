package com.skillquest.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record CandidateAssessmentDto(
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
        int attemptsUsed,
        int remainingAttempts,
        String assignmentStatus,
        String unsupportedType,
        List<Map<String, Object>> questions) {
}
