package com.skillquest.dto;

import java.util.List;
import java.util.Map;

public record CandidateSkillProfileDto(
        Map<String, CandidateSkillScoreDto> skillScores,
        List<CandidateChallengeHistoryDto> challengeHistory,
        List<CandidateAssessmentHistoryDto> assessmentResults) {
}