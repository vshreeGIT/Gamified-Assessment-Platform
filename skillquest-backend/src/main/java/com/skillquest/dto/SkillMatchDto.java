package com.skillquest.dto;

public record SkillMatchDto(
        String skill,
        int weight,
        Integer candidateScore,
        double weightedContribution,
        String evidence) {
}