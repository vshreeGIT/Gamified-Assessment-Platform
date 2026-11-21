package com.skillquest.dto;

import java.time.LocalDateTime;
import java.util.List;

public record JobApplicationDto(
        String id,
        String jobId,
        String jobTitle,
        String company,
        String candidateId,
        String candidateEmail,
        String candidateName,
        List<String> candidateSkills,
        int candidateXp,
        int candidateLevel,
        int matchScore,
        List<SkillMatchDto> skillBreakdown,
        String matchExplanation,
        List<CandidateChallengeHistoryDto> challengeHistory,
        List<CandidateAssessmentHistoryDto> assessmentResults,
        String status,
        LocalDateTime appliedAt,
        LocalDateTime updatedAt) {
}