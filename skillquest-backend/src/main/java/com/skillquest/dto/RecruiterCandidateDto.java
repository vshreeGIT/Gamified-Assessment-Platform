package com.skillquest.dto;

import java.time.LocalDateTime;
import java.util.List;

public record RecruiterCandidateDto(
        String id,
        String candidateId,
        String name,
        String email,
        String assessmentId,
        String assessmentName,
        String technology,
        Integer score,
        String status,
        LocalDateTime completedAt,
        String decision,
        String recruiterNotes,
        String headline,
        List<AssessmentHistory> assessments,
        List<SkillBreakdown> skillBreakdown) {

    public record AssessmentHistory(String id, String attemptId, String assessmentId,
                                    String assessmentName, LocalDateTime completedAt,
                                    String status, Integer score, Integer durationSeconds, String actualDuration,
                                    Integer attempts, String outcome) {
    }

    public record SkillBreakdown(String language, String concept, String difficulty, Integer score) {
    }
}
