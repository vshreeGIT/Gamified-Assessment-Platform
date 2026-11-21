package com.skillquest.dto;

import java.time.Instant;

public record CandidateSkillScoreDto(String skill, int score, String evidence, Instant completedAt) {
}